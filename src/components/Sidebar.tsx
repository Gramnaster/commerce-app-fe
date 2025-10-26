import { useState } from "react";
import { NavLink } from "react-router-dom";


interface ProductCategory {
  id: number;
  title: string;
}

const Sidebar = ({categoryData}) => {
  const [searchWord, setSearchWord] = useState('');

  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  console.log(`sidebar categoryData`, categoryData)

  return (
    <div>
      <div className="rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by Name or Date"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="w-full bg-[hsl(5,100%,98%)] border border-[#75332d] rounded-lg p-3 pl-10 text-black placeholder-[#c27971]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#75332d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="p-3 bg-[#924b43] hover:bg-[#743b35] border border-[#75332d] rounded-lg hover:cursor-pointer transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
      </div>
      heh
      {/* <div className='text-[#BE493D] font-bold'>
        <button onClick={() => setSelectedCategory(null)} className='m-1 px-2 py-2 border-2 border-[#BE493D] rounded-2xl hover:cursor-pointer hover:bg-[#BE493D] hover:text-white' >All</button>
        {categoryData.map((category: ProductCategory) => {
          const { id, title } = category;
          return (
            <button onClick={() => setSelectedCategory(`${title}`)} className='m-1 px-2 py-2 border-2 border-[#BE493D] rounded-2xl hover:cursor-pointer hover:bg-[#BE493D] hover:text-white' key={id}>{title}</button>
          )
        })}
      </div> */}
    </div>
  )
}

export default Sidebar