import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserInfo.css';

interface UserInfo {
  userAgent: string;
  language: string;
  cookieEnabled: boolean;
  hardwareConcurrency: number;
  ipAddress: string;
  network?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCapital?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  currency?: string;
  countryPopulation?: number;
  org?: string;
}

const UserInfoComponent: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const fetchIpAddress = async (): Promise<string> => {
    const response = await axios.get('https://api.ipify.org');
    return response.data;
  };

  const fetchIpInfo = async (ipAddress: string): Promise<Partial<UserInfo>> => {
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json`);
    return {
      network: response.data.network,
      city: response.data.city,
      region: response.data.region,
      country: response.data.country_name,
      countryCapital: response.data.country_capital,
      postal: response.data.postal,
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      currency: response.data.currency,
      countryPopulation: response.data.country_population,
      org: response.data.org,
    };
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const ipAddress = await fetchIpAddress();
      const ipInfo = await fetchIpInfo(ipAddress);
      setUserInfo({
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        hardwareConcurrency: navigator.hardwareConcurrency,
        ipAddress,
        network: ipInfo.network ?? '',
        city: ipInfo.city ?? '',
        region: ipInfo.region ?? '',
        country: ipInfo.country ?? '',
        countryCapital: ipInfo.countryCapital ?? '',
        postal: ipInfo.postal ?? '',
        latitude: ipInfo.latitude ?? 0,
        longitude: ipInfo.longitude ?? 0,
        timezone: ipInfo.timezone ?? '',
        currency: ipInfo.currency ?? '',
        countryPopulation: ipInfo.countryPopulation ?? 0,
        org: ipInfo.org ?? '',
      });
    };
    getUserInfo();
  }, []);

  return (
    <div className="user-info">
      <h1>User Information</h1>
      {userInfo && Object.entries(userInfo).map(([key, value]) => (
        <div key={key} className="info-box">
          <h2>{key}</h2>
          <p>{value.toString()}</p>
        </div>
      ))}
    </div>
  );
};

export default UserInfoComponent;
