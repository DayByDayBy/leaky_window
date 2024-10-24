import React, { useState, useEffect } from 'react';
import './PermissionsList.css';

interface PermissionStatus {
  name: string;
  state: PermissionState;
}

const PermissionsList = () => {
  const [permissions, setPermissions] = useState<PermissionStatus[]>([]);

  useEffect(() => {
    const permissionsToCheck = [
      'clipboard-read',
      'clipboard-write',
      'microphone',
      'camera',
      'geolocation'
    ];

    const checkPermissions = async () => {
      try {
        const permissionResults = await Promise.all(
          permissionsToCheck.map(async (permission) => {
            try {
              const result = await navigator.permissions.query({ name: permission as PermissionName });
              return {
                name: permission,
                state: result.state
              };
            } catch (error) {
              return {
                name: permission,
                state: 'unsupported' as PermissionState
              };
            }
          })
        );
        setPermissions(permissionResults);
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    };

    checkPermissions();
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
    <div className="permissions-container">
      <h2 className="permissions-title">Permissions</h2>
      <ul className="permissions-list">
        {permissions.length > 0 ? renderPermissionsList() : (
          <li className="permissions-loading">
            Loading permissions...
          </li>
        )}
      </ul>
    </div>
  );
};

export default PermissionsList;