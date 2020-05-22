import React, { useState, useEffect, useReducer, useContext } from 'react'
import { useRequest, useScroll, usePrevious } from "@umijs/hooks"
import { useParams, useHistory, useLocation } from 'react-router-dom';
import ComicItem from "../../components/ComicItem/ComicItem";
import "./index.css"
import { getCateSortList } from '../../request/api';
import { getComicIdPath } from '../../utils';

interface ICateSortParams {
  sortId: string
}

type SortType = "click" | "score" | "date";

const typeMap: { [key in SortType]: string } = {
  click: "人气",
  score: "评分",
  date: "更新"
}

interface IState {
  type: SortType;
  text: string;
}

interface IAction {
  type: SortType;
}

const defaultState: IState = { type: "click", text: "人气" };

const MyContext = React.createContext<any>(defaultState);

function reducer(state: IState, action: IAction) {
  const keys = Object.keys(typeMap) as Array<SortType>;
  const findAction = keys.find(k => Object.is(action.type, k));
  if (findAction) {
    window.scrollTo(0, 0)
    return { type: findAction, text: typeMap[findAction] }
  } else {
    console.warn("unkonw type: " + action.type);
    return state;
  }
}

function useSortChange(initialState = defaultState) {
  const [state, dispatch] = useReducer(reducer, initialState);
  function onTypeChange(type: SortType) {
    dispatch({ type })
  }
  return { state, onTypeChange }
}


export default function CateSort() {

  const { sortId } = useParams<ICateSortParams>();
  const [comicList, setComicList] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const { state, onTypeChange } = useSortChange();
  const [isFinished, setFinished] = useState(false);
  const sortType = state.type;
  const previousType = usePrevious(sortType)

  useEffect(() => {
    if (sortType !== previousType) {
      setPage(1);
      setFinished(false);
    }
  }, [sortType, previousType])

  const [scroll] = useScroll(document)

  const { run, loading } = useRequest(getCateSortList, {
    manual: true,
    onSuccess: (response, params) => {
      const data = response.data.data as any;
      const [, , page] = params;
      const list = data.page.comic_list;
      if (data.page.total_page === page) {
        setFinished(true)
        return;
      }
      setComicList((olist: any) => {
        if (page === 1) {
          return list;
        } else {
          return olist.concat(list)
        }
      });
    },
    onError: () => {
      setFinished(true);
    }
  });

  useEffect(() => {
    const docHeight = document.documentElement.offsetHeight;
    const pageHeight = document.getElementById("root")?.offsetHeight || 0;
    if (pageHeight - docHeight === scroll.top) {
      setPage(p => p + 1);
    }
  }, [scroll])

  useEffect(() => {
    if (isFinished) return;
    run(sortType, sortId, page)
  }, [run, page, sortId, sortType, isFinished])

  return (
    <MyContext.Provider value={{ state, onTypeChange }}>
      <SortHeader />
      <ul className="sort-wrap">
        {
          comicList.map((item: any) => {
            const comicItemProps = {
              id: `${item.comic_id}`,
              title: item.comic_name,
              chapter: item.last_chapter?.name,
              score: (item.score / 10).toFixed(1),
              thumbImg: `https://image.zymkcdn.com/file/cover/${getComicIdPath(item.comic_id)}.jpg-300x400`
            }
            return <li key={item.comic_id} className="sort-item"> <ComicItem {...comicItemProps} /> </li>
          })
        }
      </ul>
      {loading ? <h3>加载中...</h3> : <h3>加载完成</h3>}
    </MyContext.Provider>
  )
}

function SortHeader() {
  const history = useHistory();
  const { state: stateParams } = useLocation<{ title: string }>();
  const { state, onTypeChange } = useContext(MyContext);
  const { status, removeMask, onMaskHide, onStatusChange } = useToggleShow(false);

  function goBack() {
    history.goBack();
  }

  function onSortTypeChange(type: SortType) {
    onTypeChange(type);
    onStatusChange();
  }

  return (
    <>
      <header className="hd mk-category-header" onClick={onStatusChange}>
        <div className="left">
          <i className="back ift-goback" onClick={goBack}></i>
        </div>
        <h1 className="title">{stateParams.title}</h1>
        <div className="right">
          <div className="mk-sort-select">
            <div className="hd" data-sort="click" onClick={onStatusChange}>
              <span className="text">{state.text}</span>
              <i className={`${status ? "ift-up" : "ift-down"}`}></i>
            </div>
            <div className="bd" >
              <div className={`mask ${status ? "" : "hide"} ${removeMask ? 'remove' : ''}`} onTransitionEnd={onMaskHide} onClick={onStatusChange}></div>
              <ul className={`order-list ${status ? "" : "hide"}`}>
                {
                  (Object.keys(typeMap) as []).map((keyType, index) => {
                    return <li key={index} className="item" data-sort={keyType} onClick={() => onSortTypeChange(keyType)}>{typeMap[keyType]}</li>
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </header>
      <div className="mk-header-blank"></div>
    </>
  )
}

function useToggleShow(initialStatus: boolean = false) {
  const [status, setStatus] = useState(initialStatus);
  const [removeMask, setRemoveMask] = useState(true);

  function onStatusChange() {
    setStatus(!status);
  }

  useEffect(() => {
    if (status) {
      setRemoveMask(false);
    }
  }, [status])

  function onMaskHide() {
    if (!status) {
      setRemoveMask(true);
    }
  }

  return {
    status,
    removeMask,
    onMaskHide,
    onStatusChange
  }
}
