import { useState, useEffect, useContext } from 'react'
import { API_URL } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { WEBSOCKET_URL } from '../constants'
import { AuthContext } from '../modules/auth_provider'
import { WebsocketContext } from '../modules/websocket_provider'
import { useRouter } from 'next/router'

const Index = () => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([])
  const [roomName, setRoomName] = useState('')
  const { user } = useContext(AuthContext)
  const { setConn } = useContext(WebsocketContext)

  const router = useRouter()

  const getRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/ws/getRooms`, {
        method: 'GET',
      })

      const data = await res.json()
      if (res.ok) {
        setRooms(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getRooms()
  }, [])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      setRoomName('')
      const res = await fetch(`${API_URL}/ws/createRoom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: uuidv4(),
          name: roomName,
        }),
      })

      if (res.ok) {
        getRooms()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const joinRoom = (roomId: string) => {
    const ws = new WebSocket(
      `${WEBSOCKET_URL}/ws/joinRoom/${roomId}?userId=${user.id}&username=${user.username}`
    )
    if (ws.OPEN) {
      setConn(ws)
      router.push('/app')
      return
    }
  }
  //выход из системы
  const LogOutHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
      localStorage.clear();
      window.location.href = '/';
    }


  return (
      <>
        <div className='my-22 px-14 md:mx-24 w-full h-full'>
          <div className='flex justify-center mt-3 p-8'>
            <input
                type='text'
                className='border border-grey p-2 rounded-md focus:outline-none focus:border-blue'
                placeholder='room name'
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <button
                className='bg-green border text-white rounded-md p-2 md:ml-4'
                onClick={submitHandler}
            >
              create room
            </button>
            <button
                className='bg-green border text-white rounded-md p-1 md:ml-2'
                onClick={LogOutHandler}
            >
              Logout
            </button>
          </div>
          <div className='mt-18'>
            <div className='font-bold'>Available Rooms</div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mt-18'>
              {rooms.map((room, index) => (
                  <div
                      key={index}
                      className='border border-light_green p-4 flex items-center rounded-md w-full'
                  >
                    <div className='w-full'>
                      <div className='text-xl'>room</div>
                      <div className='text-black font-bold text-lg'>{room.name}</div>
                    </div>
                    <div className=''>
                      <button
                          className='px-4 text-white bg-light_green rounded-md'
                          onClick={() => joinRoom(room.id)}
                      >
                        join
                      </button>

                    </div>

                  </div>
              ))}
            </div>

          </div>

        </div>

      </>
  )
}

export default Index
