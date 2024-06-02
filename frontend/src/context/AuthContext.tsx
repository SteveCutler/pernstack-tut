import {
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
    createContext,
    useEffect,
    useContext,
} from 'react'

type AuthUserType = {
    id: string
    fullName: string
    email: string
    profilePic: string
    gender: string
}

type AuthContext = {
    authUser: AuthUserType | null
    setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>
    isLoading: boolean
}

const AuthContext = createContext<AuthContext>({
    authUser: null,
    setAuthUser: () => {},
    isLoading: true,
})

export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthContextProvdider = ({ children }: { children: ReactNode }) => {
    const [authUser, setAuthUser] = useState<AuthUserType | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAuthUser = async () => {
            try {
                const res = await fetch('/api/auth/me')
                const data = await res.json()

                if (!res.ok) {
                    throw new Error('data.message')
                }
                setAuthUser(data)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAuthUser()
    }, [])
    return (
        <AuthContext.Provider value={{ authUser, isLoading, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    )
}
