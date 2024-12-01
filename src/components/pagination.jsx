import React, { Fragment, useEffect, useMemo, useState } from "react"
import { RightArrow, LeftArrow, DoubleRight,DoubleLeft, DownArrow, TickMark } from "./sidebarIcons";

const ToolTip=({element="span",children,...props})=>{
    const comBinedClassName= `invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity -translate-y-full 
                              duration-1000 bg-black text-white absolute p-1 text-sm font-light rounded-lg `+props.cssclass
   
    return React.createElement(
          element,
          {
            className: comBinedClassName.replace("\n"," "),
            ...props
          },
          children
        )
  }

const range = (start, end) => {
    let length = end - start + 1;
    /*
        Create an array For Page Numbers
    */
    return Array.from({ length }, (_, idx) => idx + start);
};
const DOTS = `•••`;
const usePagination = ({
    totalCount,
    pageSize,
    siblingCount = 1,
    currentPage
}) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(totalCount / pageSize);

        // Page Button count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
        const totalPageNumberButtons = siblingCount + 5;

        /*
          Case 1:
          If the number of pages is less than the page numbers we want to show in our
          paginationComponent, we return the range [1..totalPageCount]
        */
        if (totalPageNumberButtons >= totalPageCount) {
            return range(1, totalPageCount);
        }

        /*
            Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
        */
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

        /*
          we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
        */
        const shouldShowLeftDots = leftSiblingIndex >  siblingCount + 1;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
       
        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        /*
            Case 2: No left dots to show, but rights dots to be shown
        */
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);

            return [...leftRange, "Next "+DOTS, totalPageCount];
        }

        /*
            Case 3: No right dots to show, but left dots to be shown
        */
        if (shouldShowLeftDots && !shouldShowRightDots) {

            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            return [firstPageIndex, DOTS+" Previous", ...rightRange];
        }

        /*
            Case 4: Both left and right dots to be shown
        */
        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, "Previous "+DOTS, ...middleRange, DOTS+" Next", lastPageIndex];
        }
    }, [totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange;
};

const arrowClassName = `group min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-full 
                        last:rounded-e-full border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 `
const pageNumberButtonClassName=(active)=>`min-h-[38px] min-w-[38px] flex justify-center items-center border border-gray-200 text-gray-800  
                                            py-2 px-3 text-sm first:rounded-s-full last:rounded-e-full focus:outline-none 
                                            ${ active ? "bg-[#ffca8a]" : "hover:bg-gray-100" }`;
const Pagination = props => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 2,
        currentPage,
        pageSize=10,
        onPageSizeChange,
    } = props;

    const [goto, setGoto] = useState(1);
    
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });
    const [open,setOpen] = useState("");

    useEffect(()=>{
        window.HSStaticMethods?.autoInit();
    },[])
    
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
        setGoto("");
    };
    
    const onPrevious = () => {
        onPageChange(currentPage - 1);
        setGoto("");
    };

    let lastPage = paginationRange[paginationRange.length - 1];

    const handleSkipArrowClick=(index)=>{
        const pageBeforeNextButton = paginationRange[index-1];
        const pageAfterPreviousButton = paginationRange[index+1];
        
        return paginationRange[index].includes("Next") ?
                onPageChange( pageBeforeNextButton+(siblingCount*2)-1 )
                :
                onPageChange( pageAfterPreviousButton-(siblingCount*2)+1 )
    }


    return (
        <Fragment>
            <nav
                className="inline-flex justify-end items-center -space-x-px border-[1px] w-fit rounded-full  border-gray-400"
            >
                {/* Left navigation arrow */}
                <button type="button" className={arrowClassName + `${ currentPage===1 ? " disabled pointer-events-none " : "" }`} 
                        aria-label="Previous" onClick={onPrevious}>
                    <LeftArrow className="shrink-0 size-4" />
                    <ToolTip>Previous</ToolTip>
                </button>
                {paginationRange.map((pageNumber, index) => {

                    // Render Dots
                    if (typeof pageNumber==="string" && pageNumber.includes(DOTS)) {
                                                
                        const SkipIconComponent = pageNumber.includes("Next") ? DoubleRight : DoubleLeft;
                        
                        return (<div className={`inline-block border border-gray-200`} key={pageNumber}>
                            <button type="button" onClick={()=>handleSkipArrowClick(index)}
                                className="group min-h-[36px] min-w-[36px] flex justify-center items-center text-sm focus:outline-none focus:bg-gray-100 ">
                                
                                <span className="group-hover:hidden text-xs text-black">{DOTS}</span>
                                
                                <SkipIconComponent className="group-hover:block hidden shrink-0 size-5 text-gray-800" />
                                <ToolTip>{pageNumber.replace(DOTS,"")} {(2*siblingCount)+1} pages</ToolTip>
                            </button>
                        </div>)
                    }

                    // Render our Page Numbers
                    return (
                        <button onClick={()=>{onPageChange(pageNumber);setGoto("") }} key={pageNumber}
                            className={pageNumberButtonClassName(pageNumber===currentPage)}>
                            {pageNumber}
                        </button>
                    );
                })}
                {/*  Right Navigation arrow */}
                <button type="button" className={arrowClassName+ `${ currentPage===lastPage ? " disabled pointer-events-none " : "" }`} 
                        aria-label="Next" onClick={onNext}>
                    <RightArrow className="shrink-0 size-4" />
                    <ToolTip>Next</ToolTip>
                </button>
            </nav>
                {/* Go To Page Input Box */}
            <div className="inline-flex items-center justify-center gap-x-2 w-[180px] relative text-sm text-gray-800 whitespace-nowrap">
                <span>
                    Go to
                </span>
                <input type="number"
                    value={goto}
                    onChange={(e) => setGoto(parseInt(e.target.value) || "")}
                    onKeyDown={(e) => {
                        if(e.key === "e" || e.key === "E"){e.preventDefault()}
                        if (e.key === "Enter")
                            if (goto > 0 && goto <= Math.ceil(totalCount / pageSize))
                                onPageChange(goto)
                    }}
                    className="min-h-[36px] py-2 px-2.5 block w-12 outline-none border border-gray-400 rounded-lg text-sm text-center
                    [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
                    style={{ "MozAppearance": "textfield" }} />
                <span>
                    page
                </span>
            </div>

            <div className={`hidden invisible hs-dropdown [--placement:top-left] items-center justify-center absolute  ${open}`}>
                <button id="hs-pagination-dropdown" type="button" onClick={(e)=>{e.stopPropagation(); setOpen((prev)=>prev ? "" : "open")}}
                        className="hs-dropdown-toggle py-2 px-2.5 inline-flex items-center gap-x-1 text-sm rounded-lg border 
                                    border-gray-400 text-gray-800 shadow-sm bg-white focus:outline-none h-fit" 
                        aria-haspopup="menu" aria-expanded={Boolean(open)} aria-label="Dropdown">
                    {pageSize} Rows per page
                    <DownArrow className="shrink-0 size-4"/>
                </button>
                <div className="absolute  opacity-0 hs-dropdown-menu hs-dropdown-open:opacity-100 w-18 z-50 transition-[opacity] 
                        duration-300 mb-2 bg-white shadow-md rounded-lg p-1 space-y-0.5 -translate-y-1/2" 
                    role="menu" aria-orientation="vertical" aria-labelledby="hs-pagination-dropdown">
                    {
                        [10,30,50,100].map((size)=>{
                        return(
                            <button type="button" key={size} onClick={(e)=>{e.stopPropagation(); setOpen(""); setGoto(""); onPageChange(1); onPageSizeChange(size)}}
                                className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 
                                            hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                                {size} 
                                {
                                size===pageSize && 
                                <TickMark className="ms-auto shrink-0 size-4 text-gray-700"/>
                                }
                            </button>
                        )
                        })
                    }
                </div>
            </div>
        </Fragment>
    );
};

export default Pagination;