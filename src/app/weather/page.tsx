'use client';

import {useEffect, useState} from "react";

const styles = {
  page: {
    alignItems: "center",
    justifyItems: "center",
    gap: "64px",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  }
} as const;

type Data = {
  hourly: {
    temperature_2m: Array<number>
  }
  hourly_units: {
    temperature_2m: string
  }
}

export default function WeatherScreen() {
  const [parsedData, setParsedData] = useState<Data>()
  async function fetchWeather() {
    const data = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.72&longitude=-95.4&hourly=temperature_2m&forecast_days=1')
    const json = await data.json()
    setParsedData(json as Data)
    //console.log(parsedData.hourly_units.temperature_2m);
  }

  const [shouldRefresh, setShouldRefresh] = useState(false)
  // Run once on mount
  useEffect(() => {
    fetchWeather();
  }, [shouldRefresh]);

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <ul>
          {parsedData?.hourly.temperature_2m.map((temperature, index) => {
            return(
              <li key={index}>
                Temperature: {temperature} {parsedData.hourly_units.temperature_2m}
              </li>
            )
          })}
        </ul>
        <button onClick={event => {
          setShouldRefresh(!shouldRefresh);
        }}>
          Refresh
        </button>
      </main>
    </div>
  );
}
