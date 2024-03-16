 
import { useQuery } from "react-query"
import { toast } from "react-toastify"
import { getUserDetail } from "../api";


const useUser = () =>{
    const {data, isLoading, isError, refetch} = useQuery(
        "user",
        async () => {
            try {
                const userDetail = await getUserDetail();
                console.log(userDetail, "userdet")
                return userDetail;
            } catch (error) {
               if(!error.message.includes("not autharised")){
                toast.error("Something Went Wrong!")
               } 
            }
        },
        { refetchOnWindowFocus: false}
    );
    return { data, isLoading, isError, refetch };
}

export default useUser;

