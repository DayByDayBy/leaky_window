import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./UserInfo.css";




interface IpInfo {
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    country_capital?: string;
    postal?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    currency?: string;
    country_population?: number;
    org?: string;
    network?: string;
}


interface UserInfo {
    time: {
        localTime: string;
        timezone?: string;
        timeZoneOffset: number;
    };
    location: {
        city?: string;
        region?: string;
        country?: string;
        country_capital?: string;
        postal?: string;
        language?: string;
        currency?: string;
        country_population?: number;
    };
    coordinates: {
        latitude?: number;
        longitude?: number;
    };
    device: {
        screenWidth: number;
        screenHeight: number;
        deviceMemory?: number;
        hardwareConcurrency: number;
    };
    connection: {
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
    };
    browser: {
        cookiesEnabled: boolean;
        doNotTrack: string | null;
    };
    network: {
        userAgent: string;
        ipAddress: string;
        org?: string;
        network?: string;
    };
}

const UserInfoComponent: React.FC = () => {

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchIpAddress = useCallback(async (): Promise<string> => {
        try {
            const response = await axios.get("https://api.ipify.org");
            return response.data;
        } catch (error) {
            throw new Error("failed to fetch IP address");
        }
    }, []);

    const fetchIpInfo = useCallback(async (ipAddress: string): Promise<IpInfo> => {
        try {
            const response = await axios.get(`https://ipapi.co/${ipAddress}/json`);
            return response.data;
        } catch (error) {
            throw new Error("failed to fetch IP info");
        }
    }, []);

    const getUserInfo = useCallback(async () => {
        try {
            setLoading(true)
            const ipAddress = await fetchIpAddress();
            const IpInfo = await fetchIpInfo(ipAddress);

            const userInfo: UserInfo = {
                time: {
                    localTime: new Date().toLocaleString(),
                    timezone: IpInfo.timezone,
                    timeZoneOffset: new Date().getTimezoneOffset()/60,
                },
                location: {
                    city: IpInfo.city,
                    region: IpInfo.region,
                    country: IpInfo.country,
                    country_capital: IpInfo.country_capital,
                    postal: IpInfo.postal,
                    language: navigator.language,
                    currency: IpInfo.currency,
                    country_population: IpInfo.country_population,
                },
                coordinates: {
                    latitude: IpInfo.latitude,
                    longitude: IpInfo.longitude,
                },
                device: {
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height,
                    hardwareConcurrency: navigator.hardwareConcurrency,
                },
                connection: {
                    effectiveType: (navigator as any).connection?.effectiveType,
                    downlink: (navigator as any).connection?.downlink,
                    rtt: (navigator as any).connection?.rtt,
                },
                browser: {
                    cookiesEnabled: navigator.cookieEnabled,
                    doNotTrack: navigator.doNotTrack,
                },
                network: {
                    userAgent: navigator.userAgent,
                    ipAddress,
                    org: IpInfo.org,
                    network: IpInfo.network,
                },
            };

            setUserInfo(userInfo);
        } catch (error) {
            setError('failed to fetch info');
        } finally {
            setLoading(false);
        }
    }, [fetchIpAddress, fetchIpInfo]);

    useEffect(() => {
        getUserInfo();
    }, [getUserInfo]);


    const renderGroup = useCallback((
        title: string,
        data: Record<string, any>,
        className: string
        ) => (
        <div className={`info-group ${className}`}>
            <h2>{title}</h2>
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="info-item">
                    <p>{value?.toString() ?? "N/A"}</p>
                </div>
            ))}
        </div>
    ), []);



    if (loading) return <div>loading...</div>;
    if (error) return <div>error: {error}</div>;
    if (!userInfo) return null;


    return (
        <div className="user-info">
            <h1>leaky window</h1>

            {renderGroup("your coordinates", userInfo.coordinates, "coordinates-info")}
            {renderGroup("your location", userInfo.location, "location-info")}
            {renderGroup("your time", userInfo.time, "time-info")}
            {renderGroup("your device", userInfo.device, "device-info")}
            {renderGroup("your connection", userInfo.connection, "connection-info")}
            {renderGroup("your browser", userInfo.browser, "browser-info")}
            {renderGroup("your network", userInfo.network, "network-info")}
        </div>
    );
};

export default UserInfoComponent;
