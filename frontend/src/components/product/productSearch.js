import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Product from ".././product/Product";
import Loader from ".././layouts/Loader";
import MetaData from ".././layouts/MetaData";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from 'react-js-pagination';
import { useParams } from "react-router-dom";
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css'

export default function ProductSearch() {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.productsState);
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 1000]);
    const [priceChanged, setpriceChanged] = useState(price);
    const [category, setCategory] = useState(null);
    const [rating, setRating] = useState(0);


    const { keyword } = useParams();
    const categories = ['Elctronics',
        'Mobile Phones',
        'Accessories',
        'Headphones',
        'Fodd',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoors',
        'Home',
        'Laptops'];



    // console.log(currentPage);
    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo)
    }
    // console.log(error);


    useEffect(() => {

        //Checking Toasting features
        // toast('Hello Bkart App');
        // toast.success('Hello Bkart App');
        // toast.error('Hello Bkart App');
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
        dispatch(getProducts(keyword, priceChanged, category, rating, currentPage));
    }, [error, dispatch, currentPage, keyword, priceChanged, category, rating])

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <h1 id="products_heading">Search Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            <div className="col-6 col-md-3 mb-5 mt-5">
                                {/* Price Filter */}
                                <div className="px-5" onMouseUp={() => setpriceChanged(price)}>
                                    <Slider
                                        range={true}
                                        marks={
                                            {
                                                1: "$1",
                                                1000: "$1000"
                                            }
                                        }
                                        min={1}
                                        max={1000}
                                        defaultValue={price}
                                        // onAfterChange={(price) => {
                                        //     setPrice(price)
                                        // }}
                                        onChange={(price) => {
                                            setPrice(price)
                                        }}
                                        handleRender={
                                            renderProps => {
                                                return (
                                                    <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                                        <div {...renderProps.props}>

                                                        </div>
                                                    </Tooltip>
                                                )
                                            }
                                        }

                                    />
                                </div>
                                <hr className="mt-5" />
                                {/* Category Filter */}

                                <div className="mt-5">
                                    <h3 className="mb-3">Categories</h3>
                                    <ul className="pl-0">
                                        {categories.map(category =>
                                            <li
                                                style={{
                                                    cursor: "pointer",
                                                    listStyleType: "none"

                                                }}
                                                key={category}
                                                onClick={() => {
                                                    setCategory(category)
                                                }}
                                            >
                                                {category}
                                            </li>

                                        )}


                                    </ul>

                                </div>


                                {/* Ratingd Filter */}
                                <hr className="mt-5" />
                                <div className="mt-5">
                                    <h4 className="mb-3">Ratings</h4>
                                    <ul className="pl-0">
                                        {[5, 4, 3, 2, 1].map(star =>
                                            <li
                                                style={{
                                                    cursor: "pointer",
                                                    listStyleType: "none"

                                                }}
                                                key={star}
                                                onClick={() => {
                                                    setRating(star)
                                                }}
                                            >
                                                <div className="rating-outer">
                                                    <div className="rating-inner"
                                                        style={{ width: `${star * 20}%` }}
                                                    ></div>
                                                </div>

                                            </li>

                                        )}


                                    </ul>
                                </div>


                            </div>
                            <div className="col-6 col-md-9">
                                <div className="row">
                                    {products && products.map(product => (
                                        <Product col={4} key={product._id} product={product} />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </section>
                    {productsCount > 0 && productsCount > resultPerPage ?
                        <div className="d-felx justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resultPerPage}
                                nextPageText={'Next'}  // Whatever text can give
                                firstPageText={'First'} // Whatever text can give
                                lastPageText={'Last'} // Whatever text can give
                                itemClass={'page-item'}  // This page-item is the default class
                                linkClass={'page-link'} // This page-link is the default class

                            />
                        </div> : null}
                </Fragment>}
        </Fragment>

    )
}