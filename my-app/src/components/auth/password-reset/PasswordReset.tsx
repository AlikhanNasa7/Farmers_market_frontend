import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const PasswordReset = () => {

    const {login} = useAuthContext();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: ""
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
                    <h2 className='text-2xl font-semibold'>Password Reset</h2>
                    <div className="flex flex-col space-y-6 w-full">
                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-gray-900 font-semibold mb-2">
                                Email
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-800"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-4'>
                        <button className='w-full rounded-full bg-black text-white text-sm font-bold py-4' type='submit'>
                            Send Email
                        </button>
                        <p className='m-auto text-sm w-fit'>
                            <Link to="/login" className='underline'>Go back</Link>
                        </p>
                    </div>
            </form>
        </div>
    )
}

export default PasswordReset