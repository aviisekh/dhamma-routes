import { INDIAN_CITIES, NEPAL_CITIES, BORDERS, COORDINATES_OVERRIDES } from '../constants/routing';


export function getBestBorder(source, centerName) {
    const isDistant = ["Mumbai", "Bengaluru", "Chennai", "Hyderabad"].includes(source);

    if (isDistant) {
        if (centerName.includes("Sudur Paschim")) return "Banbasa";
        if (centerName.includes("Surkhetta") || centerName.includes("Dang")) return "Rupaidiha";
        if (centerName.includes("Ilam") || centerName.includes("Purbanchal")) return "Panitanki";
        if (centerName.includes("Lumbini") || centerName.includes("Debdaha") || centerName.includes("Kapilvastu") || centerName.includes("Palpa")) {
            return "Sunauli";
        }
        // Default for Kathmandu Valley, Pokhara, Chitwan, Dhamma Tarai, Lukla: Kathmandu Airport (KTM)
        return "KTM";
    }

    if (centerName.includes("Sudur Paschim")) {
        if (source === "Lucknow") return "Gauriphanta";
        return "Banbasa";
    }
    
    if (centerName.includes("Surkhetta") || centerName.includes("Dang")) {
        if (source === "Delhi") return "Banbasa";
        return "Rupaidiha";
    }
    
    if (centerName.includes("Ilam") || centerName.includes("Lukla")) {
        return "Panitanki";
    }

    if (centerName.includes("Purbanchal")) {
        if (source === "Siliguri") return "Panitanki";
        return "Jogbani";
    }
    
    if (centerName.includes("Kapilvastu")) {
        if (["Delhi", "Lucknow", "Gorakhpur"].includes(source)) {
            return "Barhni";
        }
        return "Sunauli";
    }

    if (centerName.includes("Lumbini") || centerName.includes("Debdaha") || centerName.includes("Palpa") || centerName.includes("Pokhara")) {
        return "Sunauli";
    }
    
    if (centerName.includes("Nepal Vipassana Center") || 
        centerName.includes("Kotdada") || 
        centerName.includes("Kirtipur") || 
        centerName.includes("Kakani") || 
        centerName.includes("Nakkhu") || 
        centerName.includes("Chitwan") || 
        centerName.includes("Dhamma Tarai")) {
        
        if (centerName.includes("Dhamma Tarai")) return "Raxaul";
        
        if (["Delhi", "Lucknow", "Gorakhpur", "Varanasi"].includes(source)) {
            return "Sunauli";
        } else {
            return "Raxaul";
        }
    }
    
    return "Sunauli";
}

export function getIndiaToBorderSegment(source, borderKey) {
    const startCoord = [INDIAN_CITIES[source].lat, INDIAN_CITIES[source].lng];
    const endCoord = [BORDERS[borderKey].lat, BORDERS[borderKey].lng];
    
    let path = [startCoord, endCoord];
    let mode = 'road';
    let label;
    let desc;
    
    const isDistant = ["Mumbai", "Bengaluru", "Chennai", "Hyderabad"].includes(source);

    if (isDistant) {
        if (borderKey === 'KTM') {
            mode = 'air';
            if (source === 'Mumbai') {
                label = 'Direct Flight: Mumbai (BOM) ✈️ Kathmandu (KTM)';
                desc = 'Board a direct flight from Chhatrapati Shivaji Maharaj International Airport (BOM) directly to Tribhuvan International Airport (KTM) in Kathmandu (approx. 3 hours).';
            } else if (source === 'Bengaluru') {
                label = 'Connecting Flight: Bengaluru (BLR) ✈️ Kathmandu (KTM)';
                desc = 'Board a flight from Kempegowda International Airport (BLR) to Kathmandu (KTM) with a layover in New Delhi (approx. 5.5 hours total time).';
            } else if (source === 'Chennai') {
                label = 'Connecting Flight: Chennai (MAA) ✈️ Kathmandu (KTM)';
                desc = 'Take a flight from Chennai International Airport (MAA) to Kathmandu (KTM) via New Delhi (approx. 6 hours total time).';
            } else {
                label = 'Connecting Flight: Hyderabad (HYD) ✈️ Kathmandu (KTM)';
                desc = 'Book a flight from Rajiv Gandhi International Airport (HYD) to Kathmandu (KTM) with a layout in New Delhi (approx. 5.5 hours total time).';
            }
        } else if (borderKey === 'Panitanki') {
            mode = 'air';
            label = 'Flight to Bagdogra, then Taxi to Border';
            desc = 'Fly from your city to Bagdogra Airport (IXB) in Siliguri (3-4.5 hours with layover/direct options). From Bagdogra, hire a taxi or private vehicle to Panitanki Border (approx. 45 mins, 28 km).';
        } else if (borderKey === 'Sunauli') {
            mode = 'air';
            label = 'Flight to Gorakhpur (via Delhi), then Taxi to Border';
            desc = 'Fly from your city to Gorakhpur Airport (GKP) (typically with a layover in Delhi). From Gorakhpur Junction, board a local bus or hire a taxi to the Sunauli Border gate (approx. 2.5 hours, 80 km).';
        } else if (borderKey === 'Rupaidiha') {
            mode = 'air';
            label = 'Flight to Lucknow, then Road to Border';
            desc = 'Fly to Lucknow Airport (LKO). From Lucknow Kaiserbagh bus park, take a direct state transport bus (UPSRTC) or private cab to Rupaidiha Border checkpost (approx. 4 hours, 180 km).';
        } else if (borderKey === 'Banbasa') {
            mode = 'air';
            label = 'Flight to Delhi, then Train/Bus to Border';
            desc = 'Fly to New Delhi (DEL) (approx. 2 hours). From Delhi, catch the daily Purnagiri Jan Shatabdi Express to Banbasa Station (approx. 7.5 hours) or board an overnight state bus.';
        } else {
            label = `Transit to ${BORDERS[borderKey].name}`;
            desc = `Fly or travel by train from ${source} towards the ${BORDERS[borderKey].name} crossing.`;
        }
    } else if (source === 'Delhi' && borderKey === 'Sunauli') {
        const pivot = [26.76, 83.37];
        path = [startCoord, pivot, endCoord];
        mode = 'rail';
        label = 'Train & Bus Transit via Gorakhpur';
        desc = 'Board an express train (e.g. Gorakhdham Express) from New Delhi to Gorakhpur Junction (approx. 12 hours). From Gorakhpur, transfer to a local bus or private taxi to Sunauli Border (approx. 2.5 hours).';
    } else if (source === 'Delhi' && borderKey === 'Banbasa') {
        mode = 'rail';
        label = 'Purnagiri Jan Shatabdi Express';
        desc = 'Board the daily Purnagiri Jan Shatabdi Express from Delhi Rohilla directly to Banbasa Station (approx. 7.5 hours). Alternatively, catch an overnight state transport bus from Anand Vihar ISBT to Banbasa.';
    } else if (source === 'Delhi' && borderKey === 'Jogbani') {
        mode = 'rail';
        label = 'Seemanchal Express';
        desc = 'Board the direct daily Seemanchal Express from Anand Vihar Terminal (Delhi) directly to Jogbani Station (approx. 24 hours). Jogbani railway station is right next to the border gate.';
    } else if (source === 'Delhi' && borderKey === 'Barhni') {
        mode = 'rail';
        label = 'Champaran Humsafar Express';
        desc = 'Board the Champaran Humsafar Express from Delhi to Barhni Station (approx. 14 hours). The station sits directly on the border crossing, making transit extremely simple.';
    } else if (source === 'Delhi' && borderKey === 'Gauriphanta') {
        mode = 'rail';
        label = 'Train to Bareilly, then Road';
        desc = 'Take a fast train from Delhi to Bareilly or Shahjahanpur (approx. 5-6 hours), then hire a taxi or board a local bus to Gauriphanta border via Palia Kalan (approx. 4 hours).';
    } else if (source === 'Varanasi' && borderKey === 'Sunauli') {
        const pivot = [26.76, 83.37];
        path = [startCoord, pivot, endCoord];
        mode = 'rail';
        label = 'Express Train to Gorakhpur, then Road';
        desc = 'Catch a daily train from Varanasi Jn (BSB) to Gorakhpur Jn (GKP) (approx. 5 hours). From Gorakhpur, board a local bus or taxi to Sunauli (approx. 2.5 hours). Direct cabs via NH28 take approx. 6 hours.';
    } else if (source === 'Lucknow' && borderKey === 'Sunauli') {
        const pivot = [26.76, 83.37];
        path = [startCoord, pivot, endCoord];
        mode = 'road';
        label = 'Direct Highway Bus / Train via Gorakhpur';
        desc = 'Take a state transport bus (UPSRTC) or train from Lucknow to Gorakhpur (approx. 5-6 hours), then proceed by bus/taxi to Sunauli border (approx. 2.5 hours).';
    } else if (source === 'Lucknow' && borderKey === 'Rupaidiha') {
        mode = 'road';
        label = 'Direct UPSRTC Bus to Rupaidiha';
        desc = 'Take a direct UPSRTC bus from Lucknow Kaiserbagh bus park to Rupaidiha Border checkpost (approx. 4 hours). Cabs are also readily available.';
    } else if (source === 'Lucknow' && borderKey === 'Barhni') {
        mode = 'rail';
        label = 'Direct Express Train / Highway Bus';
        desc = 'Board a direct express train or take a UPSRTC state highway bus from Lucknow via Siddharthnagar to Barhni Station (approx. 5 hours, 230 km).';
    } else if (source === 'Lucknow' && borderKey === 'Gauriphanta') {
        mode = 'road';
        label = 'Direct Road via Lakhimpur / Palia';
        desc = 'Take a state transport bus (UPSRTC) or private cab from Lucknow via Lakhimpur Kheri and Palia Kalan to the Gauriphanta border gate (approx. 5.5 hours, 240 km).';
    } else if (source === 'Gorakhpur' && borderKey === 'Sunauli') {
        mode = 'road';
        label = 'Local Bus / Private Taxi';
        desc = 'Take a local passenger bus or shared taxi directly from Gorakhpur Railway Station to the Sunauli Border checkpost (approx. 2.5 hours, 80 km).';
    } else if (source === 'Gorakhpur' && borderKey === 'Barhni') {
        mode = 'rail';
        label = 'Local Passenger DEMU Train';
        desc = 'Take a local passenger DEMU train or bus from Gorakhpur Junction directly to Barhni Station (approx. 2.5 hours, 110 km).';
    } else if (source === 'Patna' && borderKey === 'Raxaul') {
        mode = 'rail';
        label = 'Patliputra - Raxaul Intercity Express';
        desc = 'Board the Intercity Express train from Patna to Raxaul Jn (approx. 5 hours) or take a direct state transport bus to the Raxaul border town.';
    } else if (source === 'Patna' && borderKey === 'Jogbani') {
        mode = 'rail';
        label = 'Koshi Express / Intercity Train';
        desc = 'Board a direct train (like the Koshi Express) from Patna Junction to Jogbani Station (approx. 7.5 hours). Jogbani Railway Station is under 300 meters from the border gate.';
    } else if (source === 'Kolkata' && borderKey === 'Raxaul') {
        mode = 'rail';
        label = 'Mithila Express / Howrah-Raxaul Express';
        desc = 'Board a direct train like the Mithila Express from Howrah/Kolkata directly to Raxaul Junction (approx. 14 hours). Raxaul station is right beside the border.';
    } else if (source === 'Kolkata' && borderKey === 'Panitanki') {
        const pivot = [26.7145, 88.4385];
        path = [startCoord, pivot, endCoord];
        mode = 'rail';
        label = 'Train to NJP/Siliguri, then Shared Jeep';
        desc = 'Take a fast train (e.g. Padatik Express) from Kolkata/Sealdah to New Jalpaiguri (NJP) (approx. 9-10 hours). From NJP, board a shared jeep or taxi to the Panitanki Border (approx. 1 hour, 35 km).';
    } else if (source === 'Kolkata' && borderKey === 'Jogbani') {
        mode = 'rail';
        label = 'Howrah - Jogbani Express';
        desc = 'Take the overnight Howrah-Jogbani Express from Howrah Junction directly to Jogbani Station (approx. 10 hours). It is the most convenient way to reach the border from West Bengal.';
    } else if (source === 'Siliguri' && borderKey === 'Panitanki') {
        mode = 'road';
        label = 'Shared Jeep / Local Bus';
        desc = 'Take a shared jeep or state bus directly from Siliguri Junction or NJP to the Panitanki border gate (approx. 45-60 mins).';
    } else if (source === 'Darbhanga' && borderKey === 'Jaynagar') {
        mode = 'rail';
        label = 'Local Rail / Road Transit';
        desc = 'Take a passenger train or local bus from Darbhanga to Jaynagar Border Station (approx. 1.5 - 2 hours).';
    } else if (source === 'Darbhanga' && borderKey === 'Jogbani') {
        mode = 'road';
        label = 'NH27 Express Highway';
        desc = 'Travel by bus or private taxi via the East-West Highway (NH27) to Forbesganj, and then proceed to Jogbani (approx. 4 hours, 180 km).';
    } else {
        label = `Transit to ${BORDERS[borderKey].name}`;
        desc = `Travel by train or road from ${source} to the ${BORDERS[borderKey].name} crossing. Check local timetables for the best connection.`;
    }
    
    return { path, mode, label, desc };
}

export function getBorderCrossSegment(borderKey) {
    const border = BORDERS[borderKey];
    const start = [border.lat - 0.005, border.lng];
    const end = [border.lat + 0.005, border.lng];
    
    let desc;
    if (borderKey === 'Sunauli') {
        desc = 'Walk through the iconic Nepal-India Friendship Gate (approx. 500m) from Sunauli (India side) to Belahiya (Nepal side). Complete immigration checks at the respective country offices.';
    } else if (borderKey === 'Raxaul') {
        desc = 'Take a cycle rickshaw or walk 1.5 km across the Miteri Pul (Friendship Bridge) spanning the border from Raxaul to Birgunj Customs. Complete passport/ID verification.';
    } else if (borderKey === 'Panitanki') {
        desc = 'Walk or take a local rickshaw across the Mechi River bridge (approx. 1 km) from Panitanki (India) to Kakarbhitta Customs (Nepal). Clear border security.';
    } else if (borderKey === 'Rupaidiha') {
        desc = 'Cross the border checkpost on foot or via local rickshaw (1 km) into Nepalgunj. Complete customs stamping.';
    } else if (borderKey === 'Banbasa') {
        desc = 'Travel across the Sharda River Barrage on a cycle rickshaw or walk (approx. 2 km) to enter Mahendranagar, Nepal. Note that heavy vehicles are only allowed during specific hours.';
    } else if (borderKey === 'Jogbani') {
        desc = 'Walk or take a cycle rickshaw across the border crossing gate from Jogbani (India) into Biratnagar (Nepal side, approx. 500m). Complete passport/identity checks at both customs checkpoints.';
    } else if (borderKey === 'Barhni') {
        desc = 'Walk across the border gate (approx. 200m) from Barhni Railway Station (India) to Krishnanagar Customs (Nepal). Complete immigration stamps and identity verification.';
    } else if (borderKey === 'Gauriphanta') {
        desc = 'Cross the border checkpost from Gauriphanta (India side) on foot or via auto-rickshaw into Dhangadhi (Nepal side). Present your ID card/passport for customs verification.';
    } else if (borderKey === 'KTM') {
        desc = 'Clear airport immigration and customs at Tribhuvan International Airport (KTM) in Kathmandu. Indian citizens require a valid passport or voter ID card; foreign nationals can obtain a visa-on-arrival (15/30/90 days).';
    } else {
        desc = 'Walk across the border gate to clear immigration and customs.';
    }
    
    return {
        path: [start, end],
        mode: 'road',
        label: `Clear Immigration & Cross Border`,
        desc: desc
    };
}

export function getNepalToCenterSegment(borderKey, center) {
    const startCoord = [BORDERS[borderKey].lat, BORDERS[borderKey].lng];
    const endCoord = [center.latitude, center.longitude];
    
    let path = [startCoord, endCoord];
    let mode = 'road';
    let label;
    let desc;
    
    const name = center.center_name;
    const isKathmanduCenter = name.includes("Nepal Vipassana Center") || 
                              name.includes("Kotdada") || 
                              name.includes("Kirtipur") || 
                              name.includes("Kakani") || 
                              name.includes("Nakkhu");
                              
    if (borderKey === 'KTM') {
        if (isKathmanduCenter) {
            mode = 'road';
            label = 'Prepaid Taxi / App Ride (Pathao / InDrive)';
            desc = 'Hire a prepaid airport taxi or book a ride via local apps like Pathao or InDrive from Kathmandu Airport. The center is located about 12-18 km away (approx. 45-60 mins depending on traffic).';
        } else if (name.includes("Pokhara")) {
            mode = 'air';
            label = 'Option A: Domestic Flight | Option B: Tourist Bus';
            desc = '<strong>Option A (Recommended):</strong> Walk to the KTM domestic terminal and take a 25-minute flight to Pokhara International Airport (PKR), followed by a short taxi to Begnas Lake. <br><strong>Option B (Budget):</strong> Take a local taxi to Gongabu Bus Park, and board a daily tourist bus to Pokhara (approx. 7-8 hours).';
        } else if (name.includes("Chitwan")) {
            mode = 'road';
            label = 'Option A: Domestic Flight | Option B: Tourist Bus';
            desc = '<strong>Option A (Air):</strong> Take a domestic flight from KTM to Bharatpur Airport (20 mins), then local transit. <br><strong>Option B (Road):</strong> Catch a tourist bus or shared Micro from Gongabu Bus Park to Bharatpur, Chitwan (approx. 5-6 hours).';
        } else if (name.includes("Dhamma Tarai")) {
            mode = 'road';
            label = 'Option A: Flight to Simara | Option B: Tata Sumo Jeep';
            desc = '<strong>Option A:</strong> Take a domestic flight to Simara Airport (15 mins), then taxi to the center in Birgunj. <br><strong>Option B:</strong> Take a shared Tata Sumo jeep from Balkhu, Kathmandu directly to Birgunj (approx. 4-5 hours).';
        } else if (name.includes("Lukla")) {
            mode = 'air';
            label = 'Domestic Flight from KTM';
            desc = 'Lukla is only accessible by air. Catch a scheduled STOL flight from the domestic terminal to Tenzing-Hillary Airport (LUA) in Lukla (approx. 35 mins flight). Carry heavy warm clothes.';
        } else {
            label = 'Domestic Flight / Tourist Bus';
            desc = 'Take a domestic flight from KTM domestic terminal to the nearest regional airport (e.g. Biratnagar/Bhadrapur) or proceed via long-distance bus from Gongabu Bus Park.';
        }
    } else if (isKathmanduCenter) {
        if (borderKey === 'Sunauli') {
            mode = 'air';
            label = 'Option A: Fly from Bhairahawa | Option B: Tourist Bus';
            desc = '<strong>Option A (Recommended):</strong> Take a taxi (15 mins) to Gautam Buddha International Airport (BWA) in Bhairahawa. Board a 30-minute domestic flight to Kathmandu (KTM), then hire a taxi to the center. <br><strong>Option B (Budget):</strong> Take a day/night tourist bus from Belahiya Bus Park directly to Kathmandu (approx. 9-10 hours via Siddhartha/Prithvi Highway).';
        } else if (borderKey === 'Raxaul') {
            mode = 'road';
            label = 'Shared Tata Sumo Jeep';
            desc = 'Take a local auto-rickshaw to the Clock Tower Sumo Counter in Birgunj. Catch a shared Tata Sumo jeep to Kathmandu via the Kanti Highway or fast-track bypass (approx. 4-5 hours). Standard buses are also available (6-7 hours).';
        } else if (borderKey === 'Panitanki') {
            mode = 'air';
            label = 'Fly from Bhadrapur | Option B: Long-distance Bus';
            desc = '<strong>Option A (Recommended):</strong> Take a taxi to Bhadrapur Airport (BDP) (45 mins) and fly to Kathmandu (KTM) (45 mins flight). <br><strong>Option B (Budget):</strong> Take a long-distance overnight bus from Kakarbhitta Bus Park to Kathmandu (approx. 12-14 hours).';
        } else {
            label = 'Domestic Flight / Tourist Bus to Kathmandu';
            desc = 'Travel from the border to Kathmandu Valley by bus (approx. 12-16 hours) or take a flight from the nearest domestic airport (Dhangadhi/Nepalgunj) to Kathmandu (30-60 mins).';
        }
    } else if (name.includes("Lumbini Vipassana Center")) {
        label = 'Local Rickshaw / Taxi';
        desc = 'Vipassana Center is near the Lumbini Peace Flame. Take a direct taxi or local auto-rickshaw from Belahiya border to the center (approx. 30 mins, 22 km).';
    } else if (name.includes("Debdaha Vipassana Center")) {
        label = 'Local Taxi / Bus via Butwal';
        desc = 'Debdaha is 30 km from the border. Take a taxi or local bus going towards Butwal, and transfer to Debdaha (approx. 45 mins).';
    } else if (name.includes("Kapilvastu")) {
        if (borderKey === 'Barhni') {
            label = 'Local Bus / Taxi to Taulihawa';
            desc = 'From Krishnanagar customs gate, board a local bus or shared jeep heading east/north towards Taulihawa (approx. 45 mins, 25 km). The center is situated in Banganga, Madhuwandham.';
        } else {
            label = 'Highway Bus / Cab';
            desc = 'From Belahiya (Sunauli), take a bus heading west towards Taulihawa / Kapilvastu, or hire a direct taxi to Banganga, Madhuwandham (approx. 1.5 hours).';
        }
    } else if (name.includes("Palpa")) {
        label = 'Bus / Taxi via Siddhartha Highway';
        desc = 'Board a bus or taxi going north on the Siddhartha Highway towards Tansen, Palpa. The center is located about 7-8 km before reaching Tansen (approx. 2-3 hours).';
    } else if (name.includes("Pokhara")) {
        if (borderKey === 'Sunauli') {
            label = 'Tourist Bus / Flight';
            desc = '<strong>Option A (Road):</strong> Board a tourist bus or shared jeep from Belahiya bus park to Pokhara via the Siddhartha Highway (approx. 6-7 hours). <br><strong>Option B (Air):</strong> Take a domestic flight from Bhairahawa Airport (BWA) to Pokhara (PKR) (20 mins).';
        } else {
            label = 'Highway Bus / Jeep';
            desc = 'Take a long-distance bus or jeep to Pokhara bus park, and then hire a local taxi to the center in Begnas Lake area.';
        }
    } else if (name.includes("Chitwan")) {
        label = 'Local Bus / Shared Sumo';
        desc = 'Take a bus from Birgunj or Sunauli border heading towards Bharatpur, Chitwan (approx. 3 - 3.5 hours). The center is in Bharatpur-16.';
    } else if (name.includes("Dhamma Tarai")) {
        label = 'Local Rickshaw / Auto';
        desc = 'The center is located in Parwanipur, Birgunj. Take a local auto-rickshaw or taxi north from Birgunj custom point (approx. 15 mins, 9 km).';
    } else if (name.includes("Purbanchal")) {
        if (borderKey === 'Jogbani') {
            label = 'Local Bus / Auto-rickshaw to Itahari';
            desc = 'From Biratnagar border crossing, take a local auto-rickshaw to the main Biratnagar Bus Park (approx. 3 km). Board a local bus heading north to Itahari (approx. 45 mins, 22 km). Get off at Itahari-8, near the Purbanchal Vipassana Center.';
        } else {
            label = 'East-West Highway Bus';
            desc = 'From Kakarbhitta border (Panitanki), board any bus heading west along the East-West Highway. Get off at Itahari-8 (approx. 1.5 hours, 65 km).';
        }
    } else if (name.includes("Ilam")) {
        label = 'Shared Jeep via Mechi Highway';
        desc = 'Board a shared jeep or bus heading north on the Mechi Highway to Phikkal, Ilam. The center is in Gairigaun, Phikkal (approx. 2 hours).';
    } else if (name.includes("Surkhetta")) {
        label = 'Bus / Shared Jeep via Ratna Highway';
        desc = 'Take a taxi to Nepalgunj Bus Park. Board a bus or shared jeep heading north on the Ratna Highway to Birendranagar, Surkhet (approx. 2.5 - 3 hours).';
    } else if (name.includes("Dang")) {
        label = 'Highway Jeep / Bus';
        desc = 'From Nepalgunj, catch a bus or shared vehicle to Ghorahi, Dang (approx. 2.5 - 3 hours).';
    } else if (name.includes("Sudur Paschim")) {
        if (borderKey === 'Gauriphanta') {
            label = 'Shared Jeep / Local Bus via East-West Highway';
            desc = 'From Dhangadhi customs checkpoint, take a local auto-rickshaw to Dhangadhi Bus Park (5 km). Board a shared jeep or bus heading west along the East-West Highway to Mahendranagar (approx. 1 hour, 45 km). The center is in Tilachaur-8.';
        } else {
            label = 'Local Rickshaw / Auto';
            desc = 'The center is located in Tilachaur-8, Mahendranagar. Just cross the Banbasa border and take a short 15-minute auto-rickshaw ride directly to the center.';
        }
    } else if (name.includes("Lukla")) {
        mode = 'air';
        label = 'STOL Flight from Kathmandu';
        desc = 'Lukla is only accessible by air or multi-day trek. Travel to Kathmandu first, then book a flight from Kathmandu Airport (KTM) or Ramechhap to Tenzing-Hillary Airport (LUA) in Lukla (35 mins). Carry heavy warm clothes.';
        const ktm = COORDINATES_OVERRIDES["Nepal Vipassana Center"];
        path = [[ktm.lat, ktm.lng], endCoord];
    } else {
        label = 'Local Transit to Center';
        desc = 'From the border, take a local bus, shared jeep, or taxi to the Vipassana center. Contact the center for specific transport guidelines.';
    }
    
    return { path, mode, label, desc };
}

function getBezierPoints(start, end, curvature = 0.15) {
    const [lat0, lng0] = start;
    const [lat1, lng1] = end;
    
    const midLat = (lat0 + lat1) / 2;
    const midLng = (lng0 + lng1) / 2;
    
    const dLat = lat1 - lat0;
    const dLng = lng1 - lng0;
    
    // Calculate a control point to bend the flight vector upwards (north)
    const cLat = midLat + Math.abs(dLng) * curvature + 0.3;
    const cLng = midLng - dLat * curvature;
    
    const points = [];
    const steps = 30;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const mt = 1 - t;
        const lat = mt * mt * lat0 + 2 * mt * t * cLat + t * t * lat1;
        const lng = mt * mt * lng0 + 2 * mt * t * cLng + t * t * lng1;
        points.push([lat, lng]);
    }
    return points;
}

export function getDomesticToCenterSegment(source, center) {
    const startCoord = [NEPAL_CITIES[source].lat, NEPAL_CITIES[source].lng];
    const endCoord = [center.latitude, center.longitude];
    
    let path = [startCoord, endCoord];
    let mode = 'road';
    let label = 'Highway Bus / Private Taxi';
    let desc = '';
    
    const name = center.center_name;
    const isKathmanduCenter = name.includes("Nepal Vipassana Center") || 
                              name.includes("Kotdada") || 
                              name.includes("Kirtipur") || 
                              name.includes("Kakani") || 
                              name.includes("Nakkhu");
                              
    if (source === 'Kathmandu') {
        if (isKathmanduCenter) {
            label = 'Local Taxi / Public Transit';
            desc = 'The center is located in Kathmandu Valley. You can hire a local taxi or book a ride via local apps (Pathao / InDrive) from anywhere in Kathmandu (approx. 30-60 mins depending on traffic).';
        } else if (name.includes("Pokhara")) {
            mode = 'air';
            label = 'Option A: Flight to Pokhara | Option B: Tourist Bus';
            desc = '<strong>Option A (Air):</strong> Take a 25-minute flight from KTM Domestic Terminal to Pokhara International Airport, then taxi to Begnas Lake. <br><strong>Option B (Road):</strong> Board a tourist bus or shared Micro from Gongabu Bus Park to Pokhara (approx. 7-8 hours).';
        } else if (name.includes("Chitwan")) {
            label = 'Option A: Tourist Bus | Option B: Flight';
            desc = '<strong>Option A (Road):</strong> Catch a daily tourist bus from Gongabu Bus Park or Kalanki to Bharatpur, Chitwan (approx. 5-6 hours). <br><strong>Option B (Air):</strong> Take a 20-minute flight from KTM to Bharatpur Airport.';
        } else if (name.includes("Lumbini") || name.includes("Debdaha") || name.includes("Kapilvastu") || name.includes("Palpa")) {
            mode = 'air';
            label = 'Option A: Fly to Bhairahawa | Option B: Tourist Bus';
            desc = '<strong>Option A (Air):</strong> Take a 35-minute domestic flight from KTM to Gautam Buddha International Airport (BWA) in Bhairahawa, then local taxi/bus to center. <br><strong>Option B (Road):</strong> Take a day/night tourist bus from Gongabu Bus Park to Bhairahawa/Lumbini (approx. 8-9 hours).';
        } else if (name.includes("Lukla")) {
            mode = 'air';
            label = 'Scheduled STOL Flight from Kathmandu';
            desc = 'Lukla is only accessible by air. Take a scheduled STOL flight from KTM domestic terminal to Tenzing-Hillary Airport (LUA) in Lukla (approx. 35 mins).';
        } else if (name.includes("Purbanchal") || name.includes("Ilam")) {
            mode = 'air';
            label = 'Option A: Fly to Biratnagar/Bhadrapur | Option B: Overnight Bus';
            desc = '<strong>Option A:</strong> Take a domestic flight to Biratnagar (45 mins) or Bhadrapur (45 mins) from Kathmandu, then local taxi/bus. <br><strong>Option B:</strong> Board an overnight deluxe bus from Gongabu Bus Park to Itahari/Kakarbhitta (10-12 hours).';
        } else if (name.includes("Sudur Paschim")) {
            mode = 'air';
            label = 'Option A: Fly to Dhangadhi | Option B: Overnight Bus';
            desc = '<strong>Option A:</strong> Take a domestic flight to Dhangadhi Airport (1 hr 15 mins), then taxi or local bus to Mahendranagar (approx. 1 hour). <br><strong>Option B:</strong> Take an overnight deluxe bus from Gongabu to Mahendranagar (approx. 14-15 hours).';
        } else {
            label = 'Tourist Bus / Domestic Flight';
            desc = 'Proceed via domestic flight to the nearest regional airport, or board a long-distance bus from Gongabu Bus Park.';
        }
    } else if (source === 'Pokhara') {
        if (name.includes("Pokhara")) {
            label = 'Local Taxi / Begnas Lake Boat/Bus';
            desc = 'The center is situated near Begnas Lake. Take a local bus from Prithvi Chowk to Begnas, or hire a direct taxi from Lakeside (approx. 45 mins, 20 km).';
        } else if (isKathmanduCenter) {
            mode = 'air';
            label = 'Option A: Tourist Bus | Option B: Domestic Flight';
            desc = '<strong>Option A (Road):</strong> Board a daily tourist bus from Tourist Bus Park (Lakeside) to Gongabu, Kathmandu (7-8 hours). <br><strong>Option B (Air):</strong> Take a 25-minute flight to Kathmandu (KTM) from Pokhara Airport.';
        } else if (name.includes("Lumbini") || name.includes("Debdaha") || name.includes("Palpa") || name.includes("Kapilvastu")) {
            label = 'Highway Bus via Siddhartha Highway';
            desc = 'Take a local passenger bus or shared jeep from Pokhara heading south along the Siddhartha Highway towards Butwal/Bhairahawa (approx. 6-7 hours).';
        } else if (name.includes("Chitwan")) {
            label = 'Tourist Bus to Chitwan';
            desc = 'Board a tourist bus or shared Micro from Pokhara Tourist Bus Park to Bharatpur/Chitwan (approx. 5-6 hours).';
        } else {
            label = 'Highway Bus / Transit via Kathmandu';
            desc = 'Travel by road or air to Kathmandu or Butwal, then transfer to your destination center.';
        }
    } else if (source === 'Biratnagar') {
        if (name.includes("Purbanchal")) {
            label = 'Local Bus / Auto-rickshaw';
            desc = 'Take a local bus or shared auto north from Biratnagar to Itahari (approx. 45 mins, 22 km). The center is in Itahari-8.';
        } else if (name.includes("Ilam")) {
            label = 'Shared Jeep via Mechi Highway';
            desc = 'Take a shared jeep or bus from Biratnagar to Phikkal, Ilam (approx. 3-4 hours).';
        } else if (isKathmanduCenter) {
            mode = 'air';
            label = 'Option A: Domestic Flight | Option B: Overnight Bus';
            desc = 'Fly from Biratnagar Airport to Kathmandu (45 mins) or take an overnight bus along the East-West Highway (approx. 10-12 hours).';
        } else {
            label = 'Transit via Itahari / East-West Highway';
            desc = 'Take a local bus or taxi to Itahari, then board a long-distance bus along the East-West Highway to your destination.';
        }
    } else if (source === 'Bhairahawa' || source === 'Butwal') {
        if (name.includes("Lumbini")) {
            label = 'Local Rickshaw / Taxi';
            desc = 'Lumbini is nearby. Take a local auto-rickshaw or taxi directly to the Lumbini Vipassana Center (approx. 20-30 mins).';
        } else if (name.includes("Kapilvastu")) {
            label = 'Local Bus / Shared Jeep';
            desc = 'Take a local bus heading west towards Taulihawa / Kapilvastu (approx. 1 hour).';
        } else if (name.includes("Palpa")) {
            label = 'Bus via Siddhartha Highway';
            desc = 'Board a bus heading north to Tansen, Palpa (approx. 1.5 - 2 hours).';
        } else if (name.includes("Pokhara")) {
            label = 'Siddhartha Highway Bus';
            desc = 'Take a bus heading north from Butwal Bus Park directly to Pokhara (approx. 5-6 hours).';
        } else if (isKathmanduCenter) {
            mode = 'air';
            label = 'Option A: Domestic Flight | Option B: Tourist Bus';
            desc = 'Fly to Kathmandu (KTM) from Bhairahawa Airport (35 mins) or catch a day/night bus to Kathmandu (8-9 hours).';
        } else {
            label = 'East-West Highway Bus';
            desc = 'Board an express bus heading east or west along the East-West Highway from Butwal Bus Park.';
        }
    } else if (source === 'Nepalgunj') {
        if (name.includes("Surkhetta")) {
            label = 'Bus via Ratna Highway';
            desc = 'Take a local bus or shared jeep north from Nepalgunj to Birendranagar, Surkhet (approx. 2.5 - 3 hours).';
        } else if (name.includes("Dang")) {
            label = 'Shared Jeep / Highway Bus';
            desc = 'Board a bus or shared vehicle from Nepalgunj to Ghorahi, Dang (approx. 2.5 - 3 hours).';
        } else if (name.includes("Sudur Paschim")) {
            label = 'Highway Bus / Shared Jeep';
            desc = 'Travel west along the East-West Highway to Mahendranagar (approx. 4-5 hours, 180 km).';
        } else if (isKathmanduCenter) {
            mode = 'air';
            label = 'Option A: Domestic Flight | Option B: Overnight Bus';
            desc = 'Take a 50-minute flight from Nepalgunj Airport to Kathmandu, or board an overnight deluxe bus (approx. 12-14 hours).';
        } else {
            label = 'Highway Bus / Transit';
            desc = 'Proceed via Nepalgunj Bus Park along the East-West Highway to your destination.';
        }
    } else {
        if (isKathmanduCenter) {
            label = 'Tourist Bus to Kathmandu';
            desc = `Board a long-distance bus from ${source} directly to Gongabu Bus Park, Kathmandu, then hire a taxi to the center.`;
        } else {
            label = 'Domestic Road Transit';
            desc = `Hire a private taxi or take a local bus from ${source} to the Vipassana center. Contact the center for exact driving directions.`;
        }
    }
    
    return { path, mode, label, desc };
}

export function calculateFullRoute(source, center, centerName) {
    if (NEPAL_CITIES[source]) {
        const seg = getDomesticToCenterSegment(source, center);
        const route = {
            isDomestic: true,
            segments: [seg]
        };
        route.segments.forEach(seg => {
            if (seg.mode === 'air' && seg.path.length === 2) {
                seg.path = getBezierPoints(seg.path[0], seg.path[1]);
            }
        });
        return route;
    }

    const borderKey = getBestBorder(source, centerName);
    if (!borderKey) return null;
    
    const seg1 = getIndiaToBorderSegment(source, borderKey);
    const seg2 = getBorderCrossSegment(borderKey);
    const seg3 = getNepalToCenterSegment(borderKey, center);
    
    const route = {
        borderName: BORDERS[borderKey].name,
        borderKey: borderKey,
        segments: [seg1, seg2, seg3]
    };
    
    // Automatically convert straight flight segments to curved Bezier paths
    route.segments.forEach(seg => {
        if (seg.mode === 'air' && seg.path.length === 2) {
            seg.path = getBezierPoints(seg.path[0], seg.path[1]);
        }
    });
    
    return route;
}

