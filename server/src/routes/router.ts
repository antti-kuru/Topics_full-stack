import {Request, Response, Router} from "express"
import fs from "fs"
import path from "path"


const router: Router = Router()

// Db file
const dbPath = path.resolve(__dirname, "../..", "data.json") // Navigate two levels up from dist


// reading DB
const readDB = (): any => {
    try {

        console.log(dbPath)

        const data = fs.readFileSync(dbPath, "utf-8")
        return JSON.parse(data)

    } catch (error) {
        console.log("HÄR")
        console.log(error)
    }
}

// writing DB
const writeDB = (data: any) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
    } catch (error) {
        console.log(error)
    }
}


// POST call to add topic
router.post("/api/topic", async (req: Request, res: Response) => {
    try {
        console.log(req.body)

        const { topic, note, text, timestamp } = req.body
    
        const newNote = {
            name: note,
            text: text,
            timestamp: timestamp,
          }
    
        const db = readDB()
    
        // check existence
        const topicIndex = db.topics.findIndex((tpic: any) => tpic.topic === topic)
        console.log(topicIndex)
    
        if (topicIndex === -1) {
            db.topics.push({
            topic: topic,
            notes: [newNote]})
            console.log("New entry")
        } else {
            db.topics[topicIndex].notes.push(newNote)
            console.log("Addition to existing topic")
        }
    
        writeDB(db)
    
        res.status(200).json({message: "Note saved"})
    } catch (error) {
        console.log(error)
    }
 
})

// GET call to get searched topic
router.get("/api/topic/:topicName", async (req: Request, res: Response) => {

    const {topicName} = req.params

    const db = readDB()

    const topic = db.topics.find((tpic: any) => tpic.topic === topicName)

    if (!topic) {
        res.status(404).json({message: "Topic not found"})
    } 

    // Get data from Wikipedia
    // https://www.mediawiki.org/wiki/API:Opensearch

    let url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${topicName}&limit=5&namespace=0&format=json&origin=*`

    try {
        const wikiRes = await fetch(url)
        const wikiData = await wikiRes.json()
        console.log(wikiData)

        // If data is found
        if (wikiData[1].length > 0) {
            // return 5 links to wikipedia pages that are closest to the search string
            const links = wikiData[3]
            // add them to topic data
            topic.wikiLinks = links
            res.status(200).json(topic)
        }
    } catch (error) {
        console.log(error)

    }
})

// PUT call to add selected wikipedia link to existing topic
router.put("/api/topic/:topicName", async (req: Request, res: Response) => {
    const {topicName} = req.params
    const {savedWikiLink} = req.body
    console.log(savedWikiLink)

    const db = readDB()
    const topic = db.topics.find((tpic: any) => tpic.topic === topicName)

    if (!topic) {
        res.status(404).json({message: "Topic not found"})
    }
    topic.savedWikiLink = savedWikiLink
    console.log(topic)

    writeDB(db)

    res.status(200).json({ message: "Wikipedia link saved", updatedTopic: topic })

})



export default router