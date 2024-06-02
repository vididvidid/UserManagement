const generateRandomNumber =():string=>{
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const generateRoomId = ():string =>{
    const randomNum = generateRandomNumber();
    return `sdpmssRoom${randomNum}`;
};

export default generateRoomId;