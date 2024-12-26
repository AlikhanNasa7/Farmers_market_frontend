import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';


const PasswordResetConfirm = () => {
    const params = useParams();
    const {login} = useAuthContext();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            password: "",
            passwordConfirmation: ""
        },
        onSubmit: async (values: any) => {
            const {email} = values;
            //const res = await resetPassword(email);
            // if (res){
            //     console.log(res);
            // }else{
            //     navigate("/");
            // }
        }
    });

    return (
        <div className='w-4/5 flex m-auto mt-16'>
            <form className='py-4 px-6 w-[480px] bg-white rounded-3xl flex flex-col gap-8 m-auto ' onSubmit={formik.handleSubmit}>
                    <h2 className='text-2xl font-semibold'>Password Reset Confirmation</h2>
                    <div className="flex flex-col space-y-6 w-full">
                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-gray-900 font-semibold mb-2">
                                Password
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-800"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6 w-full">
                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-gray-900 font-semibold mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-800"
                                value={formik.values.passwordConfirmation}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-4'>
                        <button className='w-full rounded-full bg-black text-white text-sm font-bold py-4' type='submit'>
                            Update Password
                        </button>
                    </div>
            </form>
        </div>
    )
}

export default PasswordResetConfirm