export const CITIES = {
    "Delhi": { name: "Delhi", lat: 28.6139, lng: 77.2090, label: "Delhi (Capital Hub)" },
    "Gorakhpur": { name: "Gorakhpur", lat: 26.7606, lng: 83.3731, label: "Gorakhpur (UP)" },
    "Varanasi": { name: "Varanasi", lat: 25.3176, lng: 82.9739, label: "Varanasi (UP)" },
    "Lucknow": { name: "Lucknow", lat: 26.8467, lng: 80.9462, label: "Lucknow (UP)" },
    "Patna": { name: "Patna", lat: 25.5941, lng: 85.1376, label: "Patna (Bihar)" },
    "Darbhanga": { name: "Darbhanga", lat: 26.1542, lng: 85.8918, label: "Darbhanga (Bihar)" },
    "Kolkata": { name: "Kolkata", lat: 22.5726, lng: 88.3639, label: "Kolkata (WB)" },
    "Siliguri": { name: "Siliguri", lat: 26.7145, lng: 88.4385, label: "Siliguri / NJP (WB)" },
    "Mumbai": { name: "Mumbai", lat: 19.0760, lng: 72.8777, label: "Mumbai (MH)" },
    "Bengaluru": { name: "Bengaluru", lat: 12.9716, lng: 77.5946, label: "Bengaluru (KA)" },
    "Chennai": { name: "Chennai", lat: 13.0827, lng: 80.2707, label: "Chennai (TN)" },
    "Hyderabad": { name: "Hyderabad", lat: 17.3850, lng: 78.4867, label: "Hyderabad (TG)" }
};

export const BORDERS = {
    "Banbasa": { name: "Banbasa Border", lat: 28.9882, lng: 80.1472, desc: "Banbasa (India) / Mahendranagar (Nepal) Crossing" },
    "Rupaidiha": { name: "Rupaidiha Border", lat: 28.0010, lng: 81.6210, desc: "Rupaidiha (India) / Nepalgunj (Nepal) Crossing" },
    "Sunauli": { name: "Sunauli Border", lat: 27.4385, lng: 83.4681, desc: "Sunauli (India) / Belahiya (Nepal) Crossing" },
    "Raxaul": { name: "Raxaul Border", lat: 27.0016, lng: 84.8715, desc: "Raxaul (India) / Birgunj (Nepal) Crossing" },
    "Jaynagar": { name: "Jaynagar Border", lat: 26.6083, lng: 86.1362, desc: "Jaynagar (India) / Janakpur (Nepal) Crossing" },
    "Panitanki": { name: "Panitanki Border", lat: 26.6385, lng: 88.1612, desc: "Panitanki (India) / Kakarbhitta (Nepal) Crossing" },
    "KTM": { name: "Kathmandu Airport (KTM)", lat: 27.6980, lng: 85.3590, desc: "Tribhuvan International Airport (KTM) Entry Port" }
};

export const COORDINATES_OVERRIDES = {
    "Nepal Vipassana Center": { lat: 27.7816, lng: 85.3582 }, 
    "Kotdada Vipassana Center": { lat: 27.5615, lng: 85.3111 }, 
    "Kirtipur Vipassana Center": { lat: 27.6767, lng: 85.2782 }, 
    "Kakani Vipassana Center": { lat: 27.8105, lng: 85.2530 }, 
    "Nakkhu Prison Vipassana Center": { lat: 27.6648, lng: 85.3120 }, 
    "Lumbini Vipassana Center": { lat: 27.4816, lng: 83.2737 }, 
    "Debdaha Vipassana Center": { lat: 27.6830, lng: 83.5645 }, 
    "Kapilvastu Vipassana Center": { lat: 27.6200, lng: 83.0500 }, 
    "Palpa Vipassana Center": { lat: 27.8600, lng: 83.5500 }, 
    "Pokhara Vipassana Center": { lat: 28.1818, lng: 84.0955 }, 
    "Chitwan Vipassana Center": { lat: 27.6181, lng: 84.4536 }, 
    "Dhamma Tarai Vipassan Center": { lat: 27.0650, lng: 84.8870 }, 
    "Purbanchal Vipassana Center": { lat: 26.6623, lng: 87.2749 }, 
    "Ilam Vipassana Center": { lat: 26.9023, lng: 88.0838 }, 
    "Surkhetta Vipassana Center": { lat: 28.5833, lng: 81.6333 }, 
    "Dang Vipassana Center": { lat: 27.9789, lng: 82.4684 }, 
    "Sudur Paschim Vipassana Center": { lat: 28.9640, lng: 80.1772 }, 
    "Lukla vipassana center": { lat: 27.6869, lng: 86.7297 }
};

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

    if (centerName.includes("Sudur Paschim")) return "Banbasa";
    
    if (centerName.includes("Surkhetta") || centerName.includes("Dang")) {
        if (source === "Delhi") return "Banbasa";
        return "Rupaidiha";
    }
    
    if (centerName.includes("Ilam") || centerName.includes("Purbanchal") || centerName.includes("Lukla")) {
        return "Panitanki";
    }
    
    if (centerName.includes("Lumbini") || centerName.includes("Debdaha") || centerName.includes("Kapilvastu") || centerName.includes("Palpa") || centerName.includes("Pokhara")) {
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
    const startCoord = [CITIES[source].lat, CITIES[source].lng];
    const endCoord = [BORDERS[borderKey].lat, BORDERS[borderKey].lng];
    
    let path = [startCoord, endCoord];
    let mode = 'road';
    let label = '';
    let desc = '';
    
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
    } else if (source === 'Gorakhpur' && borderKey === 'Sunauli') {
        mode = 'road';
        label = 'Local Bus / Private Taxi';
        desc = 'Take a local passenger bus or shared taxi directly from Gorakhpur Railway Station to the Sunauli Border checkpost (approx. 2.5 hours, 80 km).';
    } else if (source === 'Patna' && borderKey === 'Raxaul') {
        mode = 'rail';
        label = 'Patliputra - Raxaul Intercity Express';
        desc = 'Board the Intercity Express train from Patna to Raxaul Jn (approx. 5 hours) or take a direct state transport bus to the Raxaul border town.';
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
    } else if (source === 'Siliguri' && borderKey === 'Panitanki') {
        mode = 'road';
        label = 'Shared Jeep / Local Bus';
        desc = 'Take a shared jeep or state bus directly from Siliguri Junction or NJP to the Panitanki border gate (approx. 45-60 mins).';
    } else if (source === 'Darbhanga' && borderKey === 'Jaynagar') {
        mode = 'rail';
        label = 'Local Rail / Road Transit';
        desc = 'Take a passenger train or local bus from Darbhanga to Jaynagar Border Station (approx. 1.5 - 2 hours).';
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
    
    let desc = '';
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
    let label = '';
    let desc = '';
    
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
        label = 'Highway Bus / Cab';
        desc = 'From Belahiya, take a bus heading west towards Taulihawa / Kapilvastu, or hire a direct taxi to Banganga, Madhuwandham (approx. 1.5 hours).';
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
        label = 'East-West Highway Bus';
        desc = 'From Kakarbhitta border, board any bus heading west along the East-West Highway. Get off at Itahari-8 (approx. 1.5 hours, 65 km).';
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
        label = 'Local Rickshaw / Auto';
        desc = 'The center is located in Tilachaur-8, Mahendranagar. Just cross the Banbasa border and take a short 15-minute auto-rickshaw ride directly to the center.';
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

export function calculateFullRoute(source, center, centerName) {
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

