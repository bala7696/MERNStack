
import { Helmet } from 'react-helmet-async';

export default function MetaData({ title }) {
    return (
        <Helmet>
            <title>{`${title} - BKart`}</title>
        </Helmet>
    )
}