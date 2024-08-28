import React, { Children, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const {user}= useSelector(store=>store.auth)
    const navigate =useNavigate();
    useEffect(() => {
      if(!user){
        navigate('/login')
      }
    }, [])
    
  return (
    <div>{children}</div>
  )
}

export default ProtectedRoute