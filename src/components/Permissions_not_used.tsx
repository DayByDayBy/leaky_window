import React, { useState, useEffect } from 'react';

const PermissionsList = () => {
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    navigator.permissions.query({
      permissions: ['clipboard-read', 'clipboard-write', 'microphone', 'camera', 'geolocation'],
    }).then((result) => {
      setPermissions(result);
    });
  }, []);

  const renderPermissionsList = () => {
    return Object.keys(permissions).map((permission) => (
      <li key={permission}>
        <span>{permission}</span>
        <span style={{ color: permissions[permission].state === 'granted' ? 'green' : 'red' }}>
          {permissions[permission].state}
        </span>
      </li>
    ));
  };

  return (
    <div>
      <h2>Permissions:</h2>
      <ul>{renderPermissionsList()}</ul>
    </div>
  );
};


export default PermissionsList;