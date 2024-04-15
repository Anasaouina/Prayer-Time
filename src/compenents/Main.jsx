import React, { useEffect, useState } from 'react'
import Card from './Card'
import axios from 'axios'
import moment from 'moment'
import "moment/dist/locale/ar-dz";
moment.locale("ar");

export default function Main() {
        const [today, setToday]=useState();
        const [timings, setTimings] = useState({
            "Fajr": "05:04",
            "Dhuhr": "12:27",
            "Asr": "15:52",
            "Maghrib": "18:28",
            "Isha": "19:58",
        })
        const [remainingTime, setRemainingTime] = useState("");
        const [selectedCity,setSelectedCity]= useState(
            {name: "اكادير",
            value:"Agadir" }
        )
        
        const cities=  [
            {name: "اكادير",
            value:"Agadir" }, 

            {name: "الدار البيضاء",
            value:"Casablanca" },

            {name:"الرباط",
            value:"Rabat" },

            {name: "طنجة",
            value:"Tanger" },

            {name: "تيزنيت",
            value:"Tiznit" },
        ];
        const salawat = [
            { key: "Fajr", displayName: "الفجر" },
            { key: "Dhuhr", displayName: "الظهر" },
            { key: "Asr", displayName: "العصر" },
            { key: "Maghrib", displayName: "المغرب" },
            { key: "Isha", displayName: "العشاء" },
        ];
        const [ nextPrayer, setNextPrayer] = useState();


        // const [city, setCity] = useState('');

        // useEffect(() => {
        //   if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(async (position) => {
        //       const { latitude, longitude } = position.coords;
        //       try {
        //         const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        //         if (response.ok) {
        //           const data = await response.json();
        //           console.log(data);
        //           setCity(data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.county || 'Unknown');
        //         } else {
        //           console.error('Failed to fetch location data');
        //         }
        //       } catch (error) {
        //         console.error('Error fetching location data:', error);
        //       }
        //     });
        //   } else {
        //     console.error('Geolocation is not supported by this browser.');
        //   }
        // }, []);

    const getTiming = async () => {
        const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${selectedCity.value}&country=morocco&method=8`);
        setTimings(res.data.data.timings);
    }
    useEffect(()=>{
        getTiming();
       
    } , [selectedCity])
    useEffect(()=>{
        
        setToday(moment().format('MMM Do YYYY | h:mm'))
        let interval= setInterval(() => {
            setPryerCount();
        }, 1000);

        return ()=> {
            clearInterval(interval);
        }
    },[timings])

    const handelChange = (e)=>{
        const city = cities.find((city) => {
			return city.value == e.target.value;
		});
        
		setSelectedCity(city);
    }
    const setPryerCount = () => {
        const now = moment();
        let index=0;
        if (now.isAfter(moment(timings["Fajr"], "hh:mm")) && now.isBefore(moment(timings["Dhuhr"], "hh:mm"))) {
            index=1;
        } else if(now.isAfter(moment(timings["Dhuhr"], "hh:mm")) && now.isBefore(moment(timings["Asr"], "hh:mm"))) {
            index=2;
        } else if(now.isAfter(moment(timings["Asr"], "hh:mm")) && now.isBefore(moment(timings["Maghrib"], "hh:mm"))) {
            index=3;
        } else if(now.isAfter(moment(timings["Maghrib"], "hh:mm")) && now.isBefore(moment(timings["Isha"], "hh:mm"))) {
            index=4;
        }else{
            index= 0;
        }
         setNextPrayer(salawat[index].displayName);

         const nextPrayerObject = salawat[index];
		const nextPrayerTime = timings[nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(now);
        if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(now);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);

			const totalDiffernce = midnightDiff + fajrToMidnightDiff;

			remainingTime = totalDiffernce;
		}
        const durationRemainingTime = moment.duration(remainingTime);

		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);
    }
  return (
    
    <div>
      <section id='top'>
        <div className='container'>
            <div>
                <h2>{today} </h2>
                <h3>{selectedCity.name}</h3> 
            </div>
            <div>
                <h2>متبقي حتى صلاة{"  "} { nextPrayer}</h2>
                <h3>{remainingTime}</h3>
            </div>
        </div>
      </section>
      <hr />
      <section id='main'>
        <div className="container">
            <Card name="الفجر"image="https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2" time={timings.Fajr}/>
            <Card name="الظهر" image="https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921" time={timings.Dhuhr}/>
            <Card name="العصر" image="https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf" time={timings.Asr}/>
            <Card name="المغرب" image="https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5" time={timings.Maghrib}/>
            <Card name="العشاء" image="https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d" time={timings.Isha}/>
        </div>
      </section>
      <section id='bottom'>
        <div className="container" style={{marginTop:"20px"}}>
        <select name="" id="" onChange={handelChange} style={{backgroundColor:"black",color:"white",padding:"5px"}}>
            {cities.map((city)=>((
                 <option value={city.value} key={city.value} >{city.name}</option>
            )))}
               
            </select>
        </div>
           
      </section>
    </div>
  )
}
