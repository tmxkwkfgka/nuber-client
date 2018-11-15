import ApolloClient, {Operation} from "apollo-boost";


const client = new ApolloClient({
    // 리퀘스트 할때마다 호출되는 함수
    // 헤더를 로컬 스토리지 보내서 get item jwt함
    clientState:{
        defaults:{
            auth:{
                __typename: "Auth",
                isLoggedIn: Boolean(localStorage.getItem("jwt"))
            }
        },
        resolvers:{
            Mutations: {
                // resolver랑 똑같음 parent argument context
                logUserIn: (_, {token}, {cache})=>{
                    localStorage.setItem("jwt", token);
                    cache.writeData({
                       data:{
                        auth:{
                            __typename: "Auth",
                            isLoggedIn: true
                        }
                       } 
                    })
                    return null;
                },
                logUserOut:(_, __, {cache})=>{
                    // 로그아웃 시키면서 하는일
                    localStorage.removeItem("jwt");
                    cache.writeData({
                        data:{
                            __typename:"Auth",
                            isLoggedIn: false
                        }
                    })
                    return null;
                }
            }
        }

    },
    request: async(operation: Operation)=>{
        operation.setContext({
            headers: {
                "X-JWT": localStorage.getItem("jwt") || ""
            }
        })
       
    },
    uri: "http://localhost:4004/graphql"
});

export default client;