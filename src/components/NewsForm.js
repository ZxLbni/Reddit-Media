import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItems from "./NewsItem";
import Spinner from "./Spinner";

export default function NewsForm (props) {

	const [content,setcontent] = useState([])
	const [after, setafter] = useState()
	const [loading,setloading] = useState(false)
	const [error,seterror] = useState(null)
	const prop = useRef(props)
	const url = useRef()

	const fetchMoreData= async () => {
		if (props.query) {
		url.current = `https://www.reddit.com/r/${props.subreddit}/search.json?raw_json=1&limit=${props.amount}&include_over_18=true&type=link&after=${after}&q=${props.query}`
		}
		else {
        url.current=`https://www.reddit.com/r/${props.subreddit}.json?raw_json=1&limit=${props.amount}&include_over_18=true&type=link&after=${after}`
		}

		try {
			const data = await fetch(url.current)
			const parsedData = await data.json()
			setcontent(content.concat(parsedData.data.children))
			setafter(parsedData.data.after)
		}

		catch { 
			seterror("Unable To Find")
	}}

	useEffect(()=>{
	const fetchinit = async ()=>{
		prop.current.setProgress(10)
		setloading(true)
		if (prop.current.query) {
			url.current = `https://www.reddit.com/r/${prop.current.subreddit}/search.json?raw_json=1&limit=${prop.current.amount}&include_over_18=true&type=link&q=${prop.current.query}`
		}
		else {
		url.current =`https://www.reddit.com/r/${prop.current.subreddit}.json?raw_json=1&limit=${prop.current.amount}&include_over_18=true&type=link`
		}
		prop.current.setProgress(40)
		try {
			const data = await fetch(url.current)
			prop.current.setProgress(60)
			const parsedData = await data.json()
			prop.current.setProgress(80)
			setcontent(parsedData.data.children)
			setafter(parsedData.data.after)
			prop.current.setProgress(100)
			setloading(false)
		}

		catch { 
			setloading(false)
			seterror("Unable To Find")
			prop.current.setProgress(100)
	}}

		fetchinit()
	},[prop])
	
			return (
			<>
				{ loading ? <Spinner />: <div className="text-center text-white"> {props.query?<strong>Topic: </strong>:null}{props.query} <strong>Subreddit: </strong>{props.subreddit} </div>}

				<div className="text-red-600 text-center font-bold">{error}</div>

						<InfiniteScroll 
			dataLength={content.length}
			next={fetchMoreData}
			loader={<Spinner />}
			hasMore={ after?true:false }
			>
	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 m-4 p-2 gap-4">
			


					{content && content.map((item, index) => {

						return <NewsItems

							tabIndex={index}
							
							key={index}

							headline={item.data.title}

							newslink={item.data.url}

							media={ item.data.preview && item.data.preview.reddit_video_preview &&item.data.preview.reddit_video_preview.fallback_url }

							image={item.data.url_overridden_by_dest}

							speed={props.speed}

						/>


					})}

			</div>
			</InfiniteScroll>


			</>
		)
	}
