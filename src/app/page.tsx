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
  },
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    justifyContent: "center"
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    width: "100%",
    borderRadius: "5px",
    backgroundColor: "blue",
    padding: "20px",
    color: "White"
  },
  text: {
    fontFamily: "arial",
    fontSize: "20px"
  }
} as const;

type Data = {
  hourly: {
    wind_speed_10m: Array<number>
    time: Array<string>
  }
  hourly_units: {
    wind_speed_10m: string
  }
}

export default function WeatherScreen() {
  const [parsedData, setParsedData] = useState<Data>({hourly: {
    wind_speed_10m: [],
    time: [],
  },
  hourly_units: {
    wind_speed_10m: "",
  }})
  async function fetchWindSpeed() {
    const data = await fetch('https://api.open-meteo.com/v1/forecast?latitude=29.72&longitude=-95.4&hourly=wind_speed_10m')
    const json = await data.json()
    setParsedData(json as Data)
  }

  function alterTime() {
    return parsedData.hourly.time.map((time, index) => {
      let stringDate: Date = new Date(time)
      let hours: number = stringDate.getHours()
      if(hours > 12) {
        return hours-12 + ":00 PM"
      }
      else if(hours == 0){
        return "12:00 AM"
      }
      else if(hours == 12){
        return "12:00 PM"
      }
      return hours + ":00 AM"
      
    })
  }

  function getWindColor(num: number) {
    if(num > 0 && num < 1){
      return(
        'gray'
      )
    }
    else if(num >= 1 && num < 2){
      return(
        "yellow"
      )
    }
    else if(num >= 2 && num < 3){
      return(
        "green"
      )
    }
      else if(num >= 3 && num < 4){
      return(
        "blue"
      )
    }
    else if(num >= 4 && num < 5){
      return(
        "purple"
      )
    }
    else{
      return(
        "red"
      )
    }
  }

  const [shouldRefresh, setShouldRefresh] = useState(false)
  // Run once on mount
  useEffect(() => {
    fetchWindSpeed();
  }, [shouldRefresh]);

  const newList = alterTime()
  
  return (
    <div style={styles.page}>
      <main style={styles.main}>

        <div style={styles.box}>
          {parsedData?.hourly.wind_speed_10m.map((speed, index) => {
            return(
              <div key={index} style={{...styles.item, backgroundColor: getWindColor(speed)}}>
                {newList[index]} 
                <div style={styles.text}>
                {speed} {parsedData.hourly_units.wind_speed_10m}
                </div>
              </div>
            )
          })}
        </div>
        <button onClick={event => {
          setShouldRefresh(!shouldRefresh);
        }}>
          Refresh
        </button>
      </main>
    </div>
  );
}
