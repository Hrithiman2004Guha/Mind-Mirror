import {create} from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const useAuthStore = create((set)=>({
    user: null,
    token: null,
    isCheckingAuth: true,
    isLoading: false,
    register : async (username, email, password)=>{
        set({isLoading: true})
        try {
           const response = await fetch("https://moodify-2fo5.onrender.com/api/auth/register",{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({username,email,password}),
           })
           const data = await response.json();
           if(!response.ok) throw new Error(data.message || "Something went wrong")
           await AsyncStorage.setItem("user", JSON.stringify(data.user));
           await AsyncStorage.setItem("token", data.token);
           set({user: data.user, token: data.token, isLoading: false})
           return {success:true};
        } catch (error) {
            set({isLoading:false})
            return { success: false, error: error.message };
        }

    },
    logout: async()=>{
        await AsyncStorage.removeItem("user")
        await AsyncStorage.removeItem("token")
        set({user: null, token: null})
    },
    login: async(email, password)=>{
        set({isLoading:true})
        try {
            const response = await fetch("https://moodify-2fo5.onrender.com/api/auth/login",{
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({email,password})
            })
            const data = await response.json();
            if(!response.ok) throw new Error(data.message || "Something went wrong")
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            await AsyncStorage.setItem("token", data.token)
            set({user:data.user, token:data.token, isLoading:false});
            return {success:true}
        } catch (error) {
            set({isLoading:false})
            return {success:false, error:error.message}
        }
    },
    checkAuth: async()=>{
        try {
            const user = await AsyncStorage.getItem("user")
            const token = await AsyncStorage.getItem("token")
            if(user && token){
                set({user:JSON.parse(user), token, isCheckingAuth:false})
            }
        } catch (error) {
            console.log("Error occured in checking Auth")
        }finally{
            set({isCheckingAuth:false})
        }
    }
}))