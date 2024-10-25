import React, {
    useState,
    useEffect,
    useCallback,
    createContext,
    useContext,
  } from "react";
  import axios from "axios";
  import Permissions from "./Permissions";
  
  interface IpInfo {
    error?: boolean;
    reason?: string;
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
      accuracy?: number | string;
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
  
  interface LocationData {
    latitude: number;
    longitude: number;
    accuracy: number;
  }
  interface LocationContextType {
    locationData: LocationData | null;
    loading: boolean;
    error: string | null;
  }
  
  const LocationContext = createContext<LocationContextType>({
    locationData: null,
    loading: true,
    error: null,
  });
  
  const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const getLocation = useCallback(() => {
      if (!navigator.geolocation) {
        setError("Geolocation not available to your browser");
        setLoading(false);
        return;
      }
  
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setLoading(false);
        },
        (err) => {
          setError(`unable to retreive your location: ${err.message}`);
          setLoading(false);
        },
        options
      );
    }, []);
  
    useEffect(() => {
      getLocation();
    }, [getLocation]);
  
    return (
      <LocationContext.Provider value={{ locationData, loading, error }}>
        {children}
      </LocationContext.Provider>
    );
  };
  
  const useLocation = () => useContext(LocationContext);
  
  const UserInfoComponent: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {
      locationData,
      loading: locationLoading,
      error: locationError,
    } = useLocation();
  
    const fetchIpAddress = useCallback(async (): Promise<string> => {
      try {
        const response = await axios.get("https://api.ipify.org", {
          timeout: 5000,
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(`failed to fetch IP address: ${error}`);
        }
        throw error;
      }
    }, []);



  
    const fetchIpInfo = useCallback(
      async (ipAddress: string): Promise<IpInfo> => {
        try {
          const response = await axios.get(`https://ipapi.co/${ipAddress}/json`);
          return response.data;
        } catch (error) {
          throw new Error("failed to fetch IP info");
        }
      },
      []
    );
  
    const getUserInfo = useCallback(async () => {
      try {
        setLoading(true);
        const ipAddress = await fetchIpAddress();
        const IpInfo = await fetchIpInfo(ipAddress);
  
        const userInfo: UserInfo = {
          time: {
            localTime: new Date().toLocaleString(),
            timezone: IpInfo.timezone,
            timeZoneOffset: new Date().getTimezoneOffset() / 60,
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
          coordinates: locationData
            ? {
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                accuracy: locationData.accuracy,
              }
            : {
                latitude: IpInfo.latitude,
                longitude: IpInfo.longitude,
                accuracy: "IP Based Only",
              },
          device: {
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            deviceMemory: (navigator as any).deviceMemory,
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
        setError(error instanceof Error ? error.message : "failed to fetch info");
      } finally {
        setLoading(false);
      }
    }, [fetchIpAddress, fetchIpInfo, locationData]);
  
    useEffect(() => {
      if (!locationLoading) {
        getUserInfo();
      }
    }, [getUserInfo, locationLoading]);
  
    const formatValue = (key: string, value: any): string => {
      switch (key) {
        case "accuracy":
          return typeof value === "number" ? `${value.toFixed(2)} meters` : value;
        case "country_population":
          return typeof value === "number"
            ? `${value.toLocaleString()} people `
            : "n/a";
        case "latitude":
        case "longitude":
          return typeof value === "number" ? value.toFixed(4) : "n/a";
        case "deviceMemory":
          return `${value.toLocaleString()} gb`;
      case "hardwareConcurrency":
              return `${value.toLocaleString()} cores`;
        default:
          return value?.toString() ?? "n/a";
      }
    };
  
    const renderGroup = useCallback(
      (title: string, data: Record<string, any>, className: string) => (
        <section
          className={`info-group ${className}`}
          aria-label={`${title} information`}
        >
          <h2>{title}:</h2>
          {Object.entries(data).map(([key, value]) => {
            if (title === "location" && key === "country_population") {
              return (
                <React.Fragment key={key}>
                  <hr />
                  <div className="info-item">
                    <strong>{key}:</strong> {formatValue(key, value)}
                  </div>
                </React.Fragment>
              );
            }
  
            if (title === "coordinates") {
              return (
                <div key={key} className="info-item inline">
                  <strong>{key === "latitude" ? "Lat" : "Long"}: </strong>{" "}
                  {formatValue(key, value)}
                </div>
              );
            }
            return (
              <div key={key} className="info-item">
                <strong>{key}:</strong> {formatValue(key, value)}
              </div>
            );
          })}
        </section>
      ),
      []
    );
  
    if (loading)
      return (
        <div className="loading" role="status">
          loading...
        </div>
      );
    if (error)
      return (
        <div className="error" role="alert">
          error: {error}
        </div>
      );
    if (!userInfo) return null;
  
    return (
      <div className="user-info" role="main">
        <h1>leaky window</h1>
        <section className="central-content">
          {locationError && (
            <div className="location-error" role="alert">
              location error: {locationError}
            </div>
          )}
          {renderGroup(
            "your coordinates",
            userInfo.coordinates,
            "coordinates-info"
          )}
          <section className="map-placeholder">
            <p>map to be displayed here...</p>
          </section>
          <Permissions />
        </section>
  
        <section className="left-panel">
          {renderGroup("your location", userInfo.location, "location-info")}
          {renderGroup("your time", userInfo.time, "time-info")}
        </section>
        <section className="right-panel">
          {renderGroup("your network", userInfo.network, "network-info")}
          {renderGroup("your device", userInfo.device, "device-info")}
          {renderGroup("your connection", userInfo.connection, "connection-info")}
          {renderGroup("your browser", userInfo.browser, "browser-info")}

        </section>

      </div>
    );
  };
  
  export { LocationProvider };
  export default UserInfoComponent;