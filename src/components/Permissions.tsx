import React, { useState, useEffect } from 'react';

// Define possible permission states
type PermissionStateName = 'granted' | 'denied' | 'prompt' | 'unsupported';

// Define our permission status interface
interface PermissionStatus {
  name: string;
  state: PermissionStateName;
}

const PermissionsList = () => {
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<PermissionStatus[]>([]);

  useEffect(() => {
    const permissionsToCheck = [
      'clipboard-read',
      'clipboard-write',
      'microphone',
      'camera',
      'geolocation'
    ];

    const checkPermission = async (name: string): Promise<PermissionStatus> => {
      try {
        const result = await navigator.permissions.query({ name: name as PermissionName });
        return {
          name,
          state: result.state as PermissionStateName
        };
      } catch (error) {
        return {
          name,
          state: 'unsupported'
        };
      }
    };

    const checkAllPermissions = async () => {
      try {
        const results = await Promise.all(
          permissionsToCheck.map(permission => checkPermission(permission))
        );
        setPermissions(results);
      } catch (error) {
        console.error('Error checking permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAllPermissions();
  }, []);

  const renderPermissionsList = () => {
    return permissions.map((permission) => (
      <li key={permission.name} className="permission-item">
        <span className="permission-name">
          {permission.name.replace(/-/g, ' ')}
        </span>
        <span className={`permission-status ${permission.state}`}>
          {permission.state}
        </span>
      </li>
    ));
  };

  return (
    <section className="central-content">
    <div className="permissions-container">
      <h2 className="permissions-title">permissions: </h2>
      <ul className="permissions-list">
        {loading ? (
          <li className="permissions-loading">
            Loading permissions...
          </li>
        ) : permissions.length > 0 ? (
          renderPermissionsList()
        ) : (
          <li className="permissions-loading">
            no permissions available
          </li>
        )}
      </ul>
    </div>
    </section>
  );
};

export default PermissionsList;