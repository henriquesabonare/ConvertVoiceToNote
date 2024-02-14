import logo from '../../assets/Logo.svg'
import './app.css'
import { Note }from '../components/note/note'
import { NewNote } from '../components/new-note/new-note'
import { ChangeEvent, useState } from 'react';
import { Nota } from '../shared/interface/nota.interface';

const header = {
  Accept:'application/json'
}

export function App() {
  const [JSONNotes, SetJSONNotes] = useState<Nota[]>( () => {
    let nota = localStorage.getItem('notes')!
    if(nota)  
      return JSON.parse(nota)
    else
      return []
  })

  const getJsonData = () => {
    if(JSONNotes.length == 0){
      fetch('../../data/JSONDataNotas/notasRegistradas.json', {
        headers: header
      })
      .then(res => res.json())
      .then(resultado => {
        return SetJSONNotes(resultado);
      });
    }else{
      false
    }
  }

  const buscarNotas = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.value == '')
      return SetJSONNotes(JSON.parse(localStorage.getItem('notes')!))
    let newJson = JSONNotes.filter(element => element.header?.toLocaleLowerCase().includes(event.target.value.toLowerCase()) || element.textContent?.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase()))
    newJson ? SetJSONNotes(newJson): false
  }

  const changeValueJson = (data: any) => {
    SetJSONNotes(data);
  }

  const addValueJson = (data: Nota) => {
    SetJSONNotes([data, ...JSONNotes]);
    localStorage.setItem('notes', JSON.stringify([data, ...JSONNotes]))
  }

  return (
    <div onLoad={getJsonData}  className='max-w-6xl my-12 space-y-6 mx-4 md:mx-auto'>

      <img src={logo} alt='logo do site z-0' />
      <form className='w-full z-0'>
        <input onChange={buscarNotas}
          type='text' 
          placeholder='busque em suas notas'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          />
      </form>

      <div className='h-px bg-slate-700 z-0' />

      <div className='grid grid-cols-1 gap-6 auto-rows-[250px] p-5 z-10 md:grid-cols-3 ' >
        <NewNote newNote={{function: addValueJson }}  />
        {      
          JSONNotes.map((element: Nota) => {
            return (<Note key={element.id} note={{ function: changeValueJson, json:JSONNotes,  id: element.id, data: element.data = new Date().toDateString(), header: element?.header, textContent: element.textContent}}/>)
          }) 
        }
      </div>
    </div>
  ) 
}