import express, {Express, Response, Request} from "express"
import morgan from "morgan"
import router from "./routes/router"
import cors, {CorsOptions} from "cors"
import path from "path"

const port: number = 1234



const app: Express = express()


app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/", router)

if (process.env.NODE_ENV === 'development') {
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
} else if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('../..', 'client', 'build')))
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve('../..', 'client', 'build', 'index.html'))
    })
}


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})