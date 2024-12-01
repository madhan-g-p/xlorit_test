import './App.css';
import "preline/preline";
import "preline/dist/preline";
import NewsCard from './components/card';
import Navbar from './components/Navbar';
import { useCallback, useEffect, useState } from 'react';
import Pagination from './components/pagination';

// const API_URL_V1 = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&page=1&api-key=pf6FgeMTQXi38BAFb9voVvHtrEQlwUlp`
const API_URL_V2 = `https://jsonplaceholder.typicode.com/photos?_limit=9`
function App() {

  const [cardList,setCardList] = useState([]);
  const [currentPage,setCurrentPage] = useState(1);
  const [search,setSearch] = useState("")

  const fetchCardsList=useCallback(async()=>{
    const start_from = (currentPage-1) * 9;

    await fetch(API_URL_V2+`&_start=${start_from}`)
          .then((apiResp)=>{
            apiResp.json().then((json)=>
            {
              setCardList( json ||  [])
            }
          )
          })
          .catch((err)=>console.log(err))
  },[currentPage])

  useEffect(()=>{
    if(search){
      setCardList(cards=>cards.filter((card)=>card.title.includes(search)))
    }else if( !search){
      fetchCardsList();
    }
  },[search,fetchCardsList])

  useEffect(()=>{
    fetchCardsList()
  },[fetchCardsList,currentPage])

  return (
    <div className="App m-3 p-3">
      <Navbar search={search} setSearch={setSearch}/>

      <div className='grid grid-cols-3 grid-flow-row max-md:grid-cols-1 m-2 p-3 gap-2 mx-[20%]'>
        {
          cardList.map((card)=>{
            return <NewsCard key={card.id} card={card}/>
          })
        }
      </div>
      <div className='grid grid-flow-col grid-cols-2 max-md:grid-cols-1 mx-[20%]'>
      <Pagination 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={9}
        onPageSizeChange={console.log}
        totalCount={5000}
      />
      </div>
      <footer className='grid text-gray-700 grid-flow-row grid-cols-2 bg-gray-200 m-2 rounded-lg px-[20%] py-3 items-center max-md:grid-cols-1 max-md:grid-flow-row'>
        <div className='col-span-1 text-nowrap'>
          Copyright &copy; {new Date().getFullYear()} NY Times Inc
        </div>
        <div className='col-span-1'>
          Powered By XLO
        </div>
      </footer>
    </div>
  );
}

export default App;
