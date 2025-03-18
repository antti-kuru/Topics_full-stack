import { useState } from "react"
import "materialize-css/dist/css/materialize.min.css"
import "materialize-css/dist/js/materialize.min.js"
function App() {
  const [topic, setTopic] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [text, setText] = useState<string>("")

  const [searchKey, setSearchKey] = useState<string>("")
  const [topicFound, setTopicFound] = useState<boolean>(false)
  const [topicData, setTopicData] = useState<any>({})

  const getCurrentTimestamp = (): string => {
    const date = new Date()
    return date.toLocaleString()
  }


  // POST call to add topic
  const saveData = async (topic: string, note: string, text: string) => {
    try {
      const timestamp = getCurrentTimestamp()
      const data = {
        topic: topic,
        note: {
          name: note,
          text: text,
          timestamp: timestamp},
      }
  
      const res = await fetch ("/api/topic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
  
      const result = await res.json()
      console.log(result)
  

    } catch (error) {
      console.log(error)
    }
    
  }
  // GET call to search topic
  const search = async (searchKey: string) => {
    try {
     
      const res = await fetch(`/api/topic/${searchKey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })

  
      const result = await res.json()
      console.log(result.wikiLinks)
   
      if (res.status === 200) {
        setTopicData(result) // Store the data in state
        setTopicFound(true)
      } else {
        setTopicFound(false) // No topic found
      }
    } catch (error) {
      console.error("Error occurred:", error)
    }
  }
  


  // Handle submitting form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(topic, note, text)
    saveData(topic, note, text) 
  }

  // Handle searching a topic
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    search(searchKey)
  }

  // PUT call to save wikipedia link
  const saveWikiLink = async (link: string) => {
    try {
      const data = {
        savedWikiLink: link,
      }

      console.log(data)
  
      const res = await fetch (`/api/topic/${searchKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        const updatedTopic = await res.json()
        console.log(updatedTopic)
      }
  } catch (error) {
    console.log(error)
  }
}


  return (
      <div className="container">
        <div className="row">
          {/* Topic Submit Form */}
          <div
            className="col l6 m6"
            style={{
              backgroundColor: "#d4d4d4",
              marginTop: "16px",
              borderRadius: "8px",
            }}
          >
            <form onSubmit={handleSubmit}>
              <h3>Submit Topic</h3>
              <div className="input-field">
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <label htmlFor="topic">Topic</label>
              </div>
    
              <div className="input-field">
                <input
                  type="text"
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <label htmlFor="note">Note</label>
              </div>
    
              <div className="input-field">
                <input
                  type="text"
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <label htmlFor="text">Text</label>
              </div>
    
              <button type="submit" className="btn waves-effect waves-light center-align">Submit</button>
            </form>
          </div>
    
          {/* Search Form */}
          <div
            className="col l6 m6"
            style={{
              backgroundColor: "#b8ff70",
              marginTop: "16px",
              borderRadius: "8px",
            }}
          >
            <form onSubmit={handleSearch}>
              <h3>Search Topic</h3>
              <div className="input-field">
                <input
                  type="text"
                  id="search"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
                <label htmlFor="search">Search Topic</label>
              </div>
              <button type="submit" className="btn waves-effect waves-light center-align">Search</button>
            </form>
    
            {/* Display Search Result */}
            <div>
              {topicFound ? (
                <div>
                  <h5>Topic: {topicData.topic}</h5>
                  
                 {/* Display the saved Wikipedia link if available */}
                {topicData.savedWikiLink ? (
                  <div>
                    <h5>Saved Wikipedia Link:</h5>
                    <a href={topicData.savedWikiLink} target="_blank" rel="noopener noreferrer">
                      {topicData.savedWikiLink}
                    </a>
                  </div>
                ) : (
                  <>
                    {topicData.wikiLinks && topicData.wikiLinks.length > 0 ? (
                      <div>
                        <p>Related Wikipedia Articles:</p>
                        <ul>
                          {topicData.wikiLinks.map((link: string, index: number) => (
                            <li key={index}>
                              <a href={link} target="_blank" rel="noopener noreferrer">
                                {link}
                              </a>
                              <button className="btn waves-effect waves-light center-align" onClick={() => saveWikiLink(link)}>Save</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>No related Wikipedia articles found.</p>
                    )}
                  </>
                )}

    
                  {topicData.notes && topicData.notes.length > 0 ? (
                    topicData.notes.map((note: any, index: number) => (
                      <div key={index} style={{ backgroundColor: "#ccc" }}>
                        <p>Note name: {note.name.name}</p>
                        <p>Note text: {note.name.text}</p>
                        <p>Note timestamp: {note.name.timestamp}</p>
                      </div>
                    ))
                  ) : (
                    <p>No notes available.</p>
                  )}
                </div>
              ) : (
                <p>No topic found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
    
}

export default App
