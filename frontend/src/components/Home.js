import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product";
import Loader from "./layouts/Loader";
import MetaData from "./layouts/MetaData";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from 'react-js-pagination';

export default function Home() {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.productsState);
    const [currentPage, setCurrentPage] = useState(1);
    console.log(currentPage);
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
        dispatch(getProducts(null, null, null, null, currentPage));
    }, [error, dispatch, currentPage])

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product col={3} key={product._id} product={product} />
                            ))}
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