import { useState } from 'react';
import '../../../index.css'
import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale';
import { Nota } from '../../shared/interface/nota.interface';


export interface NoteProps {
    note : {
        id: string;
        header?: string;
        textContent: string;
        data: string;
        json?: Nota[];
        function?: any;
    }
}

export function Note({ note }: NoteProps) {
    const [botaoAlternar, SetBotaoAlternar] = useState<boolean>(false);
    const [conteudoHeader, SetconteudoHeader] = useState<string>('');
    const [textContent, SettextContent] = useState<string>('');

    const setBotaoAlternarAsFalse = () =>{
        SetBotaoAlternar(false)
    }

    const removeNote = (id:string) => {
        if(id){
            note.json = note.json!.filter(nota => nota.id !== id);
            note.function(note.json);
        }
    }

    const changeTextContent = (event: any): undefined => {
        note.json?.forEach(data => data.header == event.target.value || data.textContent == event.target.value ? SetBotaoAlternar(false) : SetBotaoAlternar(true) );
        botaoAlternar ? SettextContent(event.target.value): false;
    }

    const alterarNota = () => {
        note.json!.forEach(nota => {
            if(nota.header == note.header || nota.textContent == note.textContent){
                nota.header = conteudoHeader;
                nota.textContent = textContent;
            }
        })
        note.function(note.json);
    }

    const changeHeader = (event: any): undefined => {
        note.json?.forEach(data => data.header == event.target.value || data.textContent == event.target.value ? SetBotaoAlternar(false) : SetBotaoAlternar(true) );
        botaoAlternar ? SetconteudoHeader(event.target.value): false;
    }

    return (
        <Dialog.Root>
        <Dialog.Trigger asChild>
            <button onClick={setBotaoAlternarAsFalse} className='outline-none text-left rounded-md bg-slate-800 space-y-3 overflow-hidden relative  hover:ring-2 hover:ring-slate-600 focus:ring-2 focus:ring-lime-500 '>
                <span  className='text-slate-300 font-medium text-sm mx-4 ' >{`${formatDistanceToNow(note.data, {locale: ptBR}) || note.data}`}</span>
                {
                    note.header ? <p className='text-md  text-slate-400 leading-6 mx-4'>{note?.header}</p>: false 
                }           
                <p className=' text-sm text-slate-400 leading-6 mx-4'>{note.textContent}</p>
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none'></div>
            </button>
        </Dialog.Trigger>

        <Dialog.Portal >
            <Dialog.Overlay className=" inset-0 fixed bg-black/60" />
            <Dialog.Content className="max-md:h-[50%] max-md:mx-0 max-md:my-0 max-md:w-full max-md:inset-0 outline-none bg-slate-700 absolute  left-0 right-0 top-0 bottom-0 z-10 rounded-md mx-[25%] my-10 md:w-1/2 h-[50rem]">
                <div className='space-y-6'>
                    <Dialog.Title  className=  ' font-medium text-sm mx-6' >
                        <p className='text-slate-400 font-medium text-sm my-2'>{`${formatDistanceToNow(note.data, {locale: ptBR}) || note.data}`}</p>
                    </Dialog.Title>
                    <Dialog.Title className="DialogTitle mx-6 my-5 ">
                        {
                            note.header &&
                            <div>
                                <input onChange={changeHeader} className='inputHeader text-md text-slate-300 bg-transparent outline-none leading-6  w-auto' type='text' placeholder={note?.header}/>
                                <div className='h-px bg-slate-600 z-0 ' />
                            </div>
                        }    
                    </Dialog.Title>
                    <Dialog.Description className="DialogDescription mx-6">
                        <div className=''>
                            <textarea onChange={changeTextContent} className='bg-transparent outline-none px-2 py-2 border-transparent rounded-md w-full h-1/2 scroll-smooth' cols={1} rows={2   } maxLength={5000} name="" id="" placeholder={note.textContent}/>
                            <div className='h-px bg-slate-600 z-0 ' />
                        </div>
                    </Dialog.Description>
                    <Dialog.Close asChild className='group w-full absolute bottom-0 h-14'>
                        {
                            !botaoAlternar ? 
                            <button onClick={() => removeNote(note.id)} className="Button bg-slate-800 text-slate-400 font-semibold outline-none rounded-b-md hover:bg-slate-500 hover:text-slate-800">Deseja <span className='text-red-700 group-hover:underline'>apagar esta nota</span>?</button>:
                            <button type='submit' onClick={alterarNota} className="Button text-slate-700 font-semibold bg-lime-400 rounded-b-md">Salvar nota</button>
                        }
                    </Dialog.Close>
                </div>

                <Dialog.Close asChild>
                    <button className="Button absolute top-0 right-0 text-slate-700 font-semibold"><img className=' w-10 rounded-tr-lg' src="../../assets/close.png" alt="" /></button>
                </Dialog.Close>
            </Dialog.Content>
            </Dialog.Portal>
    </Dialog.Root>

    )
}

