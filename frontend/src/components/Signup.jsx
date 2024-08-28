import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Login } from "./Login";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export const Signup = () => {
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // const setLoading="loading...."

  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    // API call to signup
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate('/login')
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    if(user){
      navigate('/')
    }
  }, [])
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <form
        className="bg-white rounded-lg shadow-lg p-8 w-80"
        onSubmit={signupHandler}
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AvistaGram</h1>
          <h3 className="mt-2 text-sm text-gray-600">
            Sign up to join the community
          </h3>
        </div>

        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700">
            Username
          </Label>
          <Input
            type="text"
            className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Username"
            value={input.username}
            name="username"
            onChange={changeEventHandler}
          />
        </div>

        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            type="email"
            className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Email"
            value={input.email}
            name="email"
            onChange={changeEventHandler}
          />
        </div>

        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700">
            Password
          </Label>
          <Input
            type="password"
            className="mt-1 focus:ring-pink-500 focus:border-pink-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Password"
            value={input.password}
            name="password"
            onChange={changeEventHandler}
          />
        </div>

        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait...
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            SignUp


  
          </Button>
        )}
        <span className="text-center mt-6 text-sm">
        Have Already account..?
        <Link className="text-green-600" to='/login'>Login</Link>
        </span>
      </form>
    </div>
  );
};
