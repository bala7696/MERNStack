import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../actions/userActions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function Register() {

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");
    const [registerLocal, setRegisterLocal] = useState(false);
    const [mobileOtp, setMobileOtp] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { loading, error, isAuthenticated } = useSelector(state => state.authState);

    const onChange = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();  // Filereader is used to read the picked file.
            reader.onload = () => {         // onload fn will be called once file has chosen.
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result) // reader.result will give the url of the image
                    setAvatar(e.target.files[0])  // e.target.files[0] is the  binary data of picked image 
                }
            }
            reader.readAsDataURL(e.target.files[0])  // it will convert binary image data to url
            console.log(e.target.files[0])
        } else if (e.target.name === 'mobileNo') {

        } else {
            setUserData({ ...userData, [e.target.name]: e.target.value })
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        var expr = /^(0|91)?[6-9][0-9]{9}$/;
        if (!expr.test(userData.mobile)) {
            toast.error("Please enter valid India Number");
            return;
        }
        // setRegisterLocal(true);
        const formData = new FormData()
        formData.append('name', userData.name)
        formData.append('email', userData.email)
        formData.append('password', userData.password)
        formData.append('mobile', String(userData.mobile))
        formData.append('avatar', avatar)
        dispatch(register(formData))
    }

    const submitOtp = (e) => {
        e.preventDefault();

    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
            return
        }
        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: () => { dispatch(clearAuthError) }
            });
            return
        }
    }, [error, isAuthenticated, dispatch, navigate])

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                {!registerLocal && <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                    <h1 className="mb-3">Register</h1>

                    <div className="form-group">
                        <label htmlFor="email_field">Name</label>
                        <input
                            name="name"
                            onChange={onChange}
                            type="name"
                            id="name_field"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            name="email"
                            onChange={onChange}
                            type="email"
                            id="email_field"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            name="password"
                            onChange={onChange}
                            type="password"
                            id="password_field"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mobileNo_field">Mobile No</label>
                        <input
                            name="mobile"
                            onChange={onChange}
                            type="number"
                            id="mobileNo_field"
                            className="form-control"
                        />
                    </div>


                    <div className='form-group'>
                        <label htmlFor='avatar_upload'>Avatar</label>
                        <div className='d-flex align-items-center'>
                            <div>
                                <figure className='avatar mr-3 item-rtl'>
                                    <img
                                        src={avatarPreview}
                                        className='rounded-circle'
                                        alt='Avatar'
                                    />
                                </figure>
                            </div>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='avatar'
                                    onChange={onChange}
                                    className='custom-file-input'
                                    id='customFile'
                                />
                                <label className='custom-file-label' htmlFor='customFile'>
                                    Choose Avatar
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        id="register_button"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled={loading}
                    >
                        REGISTER
                    </button>
                </form>}

                {registerLocal && <form onSubmit={submitOtp} className="shadow-lg">
                    <h1 className="mb-3">OTP Verification</h1>
                    <div className="form-group">
                        <label htmlFor="otpMobile_field">Enter Mobile Number</label>
                        <input
                            type="number"
                            id="otpMobile_field"
                            className="form-control"
                            value={mobileOtp}
                            onChange={e => setMobileOtp(e.target.value)}
                        />
                    </div>

                    <button
                        id="forgot_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Send Email
                    </button>

                </form>

                }
            </div>
        </div>
    )
}