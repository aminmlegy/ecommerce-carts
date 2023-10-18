const bagBtn = document.querySelector('.bag-shopping');
const bagCount = document.querySelector('.bag-shopping .count');
const cardAside = document.querySelector('.card-aside');
const close = document.querySelector('.card-aside .close');
const cardList = document.querySelector('.card-list');
const mainCart = document.querySelector('.card-main');
const total = document.querySelector('.card-footer .total');
const clearCarts = document.querySelector('.card-footer .clear');
let cardArr =  JSON.parse(localStorage.getItem("cards")) || [];
let count = 0;
bagBtn.addEventListener('click' , ()=>{
    cardAside.classList.add('active')
})
close.addEventListener('click' , ()=>{
    cardAside.classList.remove('active')
});
async function loadData (){
    try{
        const data =await fetch('https://dummyjson.com/products'); 
        const res = await data.json()
        let mainArr = res.products;
        return mainArr
    }catch(error){
        console.log(error)
    }
} 
const saveCard =async (id)=>{
    const mainArr = await loadData();
    let findCard = mainArr.find((item , idx)=>{
        return (
            item.id == id
        )
    });    
    if((cardArr.find((item)=> item.id == id)) == null){
        cardArr.push({qun:1 ,...findCard })
    }else{
        cardArr = cardArr.map((item)=>{
            if(item.id == id){
                return {qun: +item.qun++ , ...item}
            }else{
                return item
            }
        })
    }
    localStorage.setItem("cards" , JSON.stringify(cardArr));
    showCarts(cardArr);
    totalCaunt(cardArr);
    countArr(cardArr)
}
function showCarts(arr){
    mainCart.innerHTML=""
    arr.forEach((item)=>{
        const cart = document.createElement('div');
        cart.classList.add('select-cart');
        cart.innerHTML=`
                <div class="cart-img">
                    <img src="${item.thumbnail}" alt="card img" >
                </div>
                <div class="cart-content">
                    <h3>${item.title}</h3>
                    <span>${item.qun} - ${item.price * item.qun}$</span>
                    <div class="actions">
                        <span class="minus" onclick="decCarts(${item.id})"><i class="fa-solid fa-minus"></i></span>
                        <span class="plus" onclick="saveCard(${item.id})"><i class="fa-solid fa-plus"></i></span>
                    </div>
                </div>
                <span class="trash" onclick="deleteCart(${item.id})"><i class="fa-solid fa-trash"></i></span>
        ` 
        mainCart.append(cart)
    })
}
 async function showItems(){
    loadData().then((data)=>{
        data.forEach((item , idx) =>{
            const cardItem = document.createElement("div");
            cardItem.classList.add('card-item')
                cardItem.innerHTML = 
                `<div class="card-img">
                    <img src="${item.thumbnail}" alt="card img" >
                    <span class="bag-span" onclick="saveCard(${item.id})">
                        <i class="fa-solid fa-bag-shopping"></i>
                    </span>
                </div>
                <div class="card-detail">
                    <h3>${item.title}</h3>
                    <span>${item.price}$</span>
                </div>
                `
            cardList.append(cardItem);
        })
    })
}
function countArr(arr){
    count = arr.reduce((acc , item)=>{
        return acc + item.qun
    },0)
    bagCount.textContent = count;
}
function decCarts(id){
    cardArr = cardArr.map((item)=>{
        if(item.id == id){
            if(item.qun <= 1){
                return {qun: 1 , ...item}
            }else{
                return {qun: +item.qun-- , ...item}
            }
        }else{
            return item
        }
    });
    showCarts(cardArr);
    totalCaunt(cardArr);
    countArr(cardArr);
    localStorage.setItem("cards" , JSON.stringify(cardArr));
}
function deleteCart(id){
    cardArr =cardArr.filter((item)=> item.id != id);
    showCarts(cardArr);
    countArr(cardArr);
    totalCaunt(cardArr);
    localStorage.setItem("cards" , JSON.stringify(cardArr));
}
function totalCaunt (arr){
   const totalNum = arr.reduce((acc , item)=>{
        return acc + (item.qun * item.price)
    },0)

     if(totalNum <= 0){
        total.classList.add('nothing')
        total.textContent = 'no items here';
    }else{
        total.classList.remove('nothing')
        total.textContent=`${totalNum} $`
    }
}
clearCarts.addEventListener('click',()=>{
    close.click();
    cardArr=[];
    localStorage.removeItem('cards');
    totalCaunt(cardArr);
    countArr(cardArr);
    showCarts(cardArr);
})
showItems();
totalCaunt(cardArr);
countArr(cardArr);
showCarts(cardArr);

