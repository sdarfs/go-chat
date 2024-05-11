import router from 'next/router';
import { useState } from 'react';
import { User } from '../../types/user';
import { registerService } from '../../service/register';
import Link from "next/link";


export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false)

    const onUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
    };

    const onPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
    };

    const onConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
    };

    const onEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
    };

    const submit = async (e: React.SyntheticEvent) => {
        try {
            e.preventDefault();
            setLoading(true)
            if (confirmPassword !== password) {
                setMessage('Wrong confirm password');
                return;
            }

            const user: User = {
                username: username,
                password: password,
                email: email,
            };

            if (username == '' || password == '' || email == '') {
                setMessage('Form must be filled');
                setLoading(false)
                return
            }

            const res = await registerService(user);

            if (res.data.code === 201) {
                setLoading(true)
                return router.push('/login');
            }

            setMessage(res.data.message);
        } catch (err) {
            console.log(err);
            setMessage('Server Error');
            setLoading(false)
        }
    };

    return (
        <>
            <div className='flex items-center justify-center min-w-full min-h-screen'>
                <div className="m-4 p-6 place-content-center">
                    <form className="flex flex-col py-12 mx-8">
                        <input
                            className=" p-3 mt-8  rounded-md focus:outline-none border-2 border-dark-primary focus:border-aqua"
                            placeholder="username"
                            onChange={onUsername}
                        />
                        <input
                            className="p-3 mt-4  rounded-md focus:outline-none border-2 border-dark-primary focus:border-aqua"
                            placeholder="email"
                            onChange={onEmail}
                        />
                        <input
                            type="password"
                            className=" p-3 mt-4  rounded-md focus:outline-none border-2 border-dark-primary focus:border-aqua"
                            placeholder="password"
                            onChange={onPassword}
                        />
                        <input
                            type="password"
                            className="p-3 mt-4  rounded-md focus:outline-none border-2 border-dark-primary focus:border-aqua"
                            placeholder="confirm password"
                            onChange={onConfirmPassword}
                        />
                        <span className="text-red mt-4 bg-red bg-opacity-10 pl-4 rounded-md">
                         {message}
                        </span>
                        <button
                            className="p-3 mt-6 rounded-md bg-light_green font-bold text-white"
                            type='submit'
                            onClick={submit}
                        >
                            <Link href="/login">Sign Up</Link>

                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}
