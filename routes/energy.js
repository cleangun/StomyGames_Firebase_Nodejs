const { initializeApp } = require('firebase/app');
const { getDatabase, get, ref, set, onValue, update} = require('firebase/database');

const express = require('express');
const { realtimeOrigin } = require('firebase-tools/lib/api');
const router = express.Router();

// Private한 값으로 따로 외부etc값으로 설정할 필요가 있음
const firebaseConfig = {
    apiKey: "AIzaSyATlQYyPo3FzSeq4pxbAfEv0LmErj6qd5I",
    authDomain: "gunproject-563f7.firebaseapp.com",
    databaseURL: "https://gunproject-563f7-default-rtdb.firebaseio.com",
    projectId: "gunproject-563f7",
    storageBucket: "gunproject-563f7.appspot.com",
    messagingSenderId: "1054169207958",
    appId: "1:1054169207958:web:7490b2c92957cf39c3deb7"
  };
const app = initializeApp(firebaseConfig)
const RealtimeDatabase = getDatabase(app)
const usercoinRef = ref(RealtimeDatabase, 'userCoin/')


router.get("/", (req,res) => {
    const userName = req.query.userName;
    if (!userName){
        // 유저 이름이 같이 보내지지 않았을때, => 에너지 차감 X
        res.status(200).send("No UserName");
    }
    else{
        decreaseEnergy(userName);
        res.status(200).send("I got user Name : "+userName);
    }
    eneryIntervalUpdate();
})
// 초기화
function EnergyInitialize(){
    // 에너지 업데이트 동작
    eneryIntervalUpdate();
}

// 5분(300000ms) 마다 Enery업데이트
function eneryIntervalUpdate(){
    setInterval(() => {
        getAllEnergies();
    }, 60000);
}

// 값을 불러와서 EneryUpdate로 값을 넘김
function getAllEnergies(){
    onValue(usercoinRef, updateEnery, {onlyOnce : true});
}
// 데이터를 받아서 Update
function updateEnery(snapshot){
    const data = snapshot.val();
    console.log(data);
    for (const key in data){
        if (data[key] < 30){
            data[key] += 5;
            if (data[key] > 30){
                data[key] = 30;
            }
        }
    }
    console.log(data);
    set(ref(RealtimeDatabase, 'userCoin/'), data);
}

async function decreaseEnergy(userName){
    var userEneryValue;
    // 해당 유저의 Energy값 받기
    await get(ref(RealtimeDatabase, 'userCoin/' + userName)).then((snapshot) => {
        userEneryValue = snapshot.val();
    }).catch((error) => {
        console.log(error);
    })

    // 업데이트할 데이터
    const updates = {};
    updates['userCoin/' + userName] = userEneryValue - 1;
    console.log(updates);

    // 변경된 데이터 업데이트
    try{
        update(ref(RealtimeDatabase), updates);
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    router,
    EnergyInitialize
};