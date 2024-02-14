import { FormEvent, useState } from 'react'
import '../../../index.css'
import * as Dialog from '@radix-ui/react-dialog'
import { Nota } from '../../shared/interface/nota.interface'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { ptBR } from 'date-fns/locale'

interface NewNote {
   newNote: 
    { 
        function:(noteProps: Nota) => void;
    }
}

export function NewNote({ newNote } : NewNote) {
    const [textoIsTrue, setTextoIsTrue] = useState<boolean>(false);
    const [audioIsTrue, setAudioIsTrue] = useState<boolean>(false);
    const [textArea, setTextArea] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [speech, setSpeech] = useState<SpeechRecognition>();
    const [audioConverted, setAudioConverted] = useState<string>('');
    const [buttonSaveIsAvailable, setButtonSaveIsAvailable] = useState<boolean>(false);

    const setTextoTrue = () => {
        setTextoIsTrue(true);
    }

    const setTextoOrAudioFalse = () => {
        if(textoIsTrue)setTextoIsTrue(false);
        else if(audioIsTrue) setAudioIsTrue(false)
    }

    const setTextoOrAudio = (event: any) => {
        if(event.keyCode == 27){
            if(textoIsTrue)setTextoIsTrue(!textoIsTrue);
            else if(audioIsTrue) setAudioIsTrue(!audioIsTrue)
        }
    }

    const setAudioTrue = () => {

        try {
            const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
            recognition.continuous = true;
            recognition.maxAlternatives = 1;
            recognition.lang = 'pt-BR';
            recognition.interimResults = true;
            recognition.onresult = (e: SpeechRecognitionEvent) => {
                setAudioConverted(e.results[0].item(0).transcript);
                console.log(e.results[0].item(0).transcript)
            } 
            setAudioIsTrue(true);
            recognition.onerror = (event) => console.error(event);
            recognition.start();
            setSpeech(recognition)
        } catch (e) {
            return alert('Seu navegador não possui reconhecimento de áudio, tente usando outro navegador!');
        }       
    }
 
    const addNoteToArray = (event:FormEvent<HTMLFormElement>) => {
        console.log(title, textArea)
        if(title === '' && textArea === '' ) 
            return
        else{ 
            event.preventDefault()
            let noteProps: Nota = {
                id: crypto.randomUUID(),
                data: formatDistanceToNow(new Date(), {locale: ptBR}),
                header:title,
                textContent: textArea,
            };
            toast.success("Nota salva com sucesso!")
            newNote.function(noteProps);
        }
    } 
    const stopRecording = () => {
        setAudioIsTrue(false);
        speech!.stop();
        setButtonSaveIsAvailable(true);
        setTextArea(audioConverted)
        setAudioIsTrue(false);
    }

    return (
    <Dialog.Root>
        <Dialog.Trigger asChild>
            <button className='text-left rounded-md bg-slate-700 space-y-3 overflow-hidden relative  hover:ring-2 hover:ring-slate-400' >
                <button><img className='absolute w-10 right-0 top-0' src="../../assets/window.png" alt="" /></button>
                <span className='text-slate-200 font-medium text-sm mx-4 absolute top-0' >Adicionar nota</span>
                <p className=' text-sm text-slate-400 leading-6 mx-4'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
            </button>
        </Dialog.Trigger>


        <Dialog.Portal >
            <Dialog.Overlay className="DialogOverlay fixed inset-0 bg-black/60" />
            <Dialog.Content onKeyDown={setTextoOrAudio} className=" max-md:h-[50%] max-md:mx-0 max-md:my-0 max-md:w-full max-md:inset-0 outline-none bg-slate-700 absolute  left-0 right-0 top-0 bottom-0 z-10 rounded-md mx-[25%] my-10 md:w-1/2 h-[50rem]">
                <div className='space-y-6'>
                    <Dialog.Title className="DialogTitle text-slate-200 mx-4 my-5 ">Adicionar nota</Dialog.Title>
                    <Dialog.Description className="DialogDescription mx-4">
                        <form onSubmit={addNoteToArray}>
                            {
                                
                                (!textoIsTrue && !audioIsTrue && !buttonSaveIsAvailable ? 
                                    <div >
                                        <span className='text-slate-400'>Comece</span> <button className='text-lime-400 hover:underline' onClick={setAudioTrue}>gravando uma nota</button> <span className='text-slate-400'>em áudio ou se preferir</span> <button onClick={setTextoTrue} className='text-lime-400 hover:underline'>utilize apenas texto.</button>
                                    </div>: false
                                )
                                ||
                                (audioIsTrue ? <button type='button' onClick={stopRecording} className='bg-slate-800 flex flex-1 justify-center items-center gap-3 text-slate-400 w-full h-14 absolute bottom-0 left-0 z-40 outline-none rounded-b-md hover:bg-slate-500 hover:text-slate-800' >
                                    <span className="relative flex h-3 w-3">
                                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                    </span>
                                    Gravando (clique para interromper)</button>: false)
                                || 
                                (textoIsTrue ?
                                <div>
                                    <input type="text" className='bg-transparent outline-none px-2 py-2 border-transparent rounded-md w-full h-1/2' placeholder='Título' onChange={(e) => setTitle(e.target.value)} />
                                    <div className='h-px bg-slate-500 z-0' />

                                    <textarea className='bg-transparent outline-none mt-4 px-2 py-2 border-transparent rounded-md w-full h-1/2 scroll-smooth' onChange={(e) =>setTextArea(e.target.value)} cols={1} rows={1} maxLength={5000} name="" id="" placeholder='Digite sua anotação' />
                                    <div className='h-px bg-slate-500 z-0' />
                                </div>
                                : false)
                                ||
                                (audioConverted ?   
                                    <div>
                                        <span className='text-slate-400' >{audioConverted}</span>
                                    </div>
                                    :false)
                            }
                            {/* <Dialog.Close asChild className='bg-lime-400 w-full absolute bottom-0 h-14'> */}
                                {
                                    !audioIsTrue || buttonSaveIsAvailable ? 
                                        <button type='submit' className="Button outline-none text-slate-700 font-semibold bg-lime-400 w-full h-14 rounded-b-md absolute left-0 bottom-0 items-center">Salvar nota</button> 
                                    : false
                                }
                                
                            {/* </Dialog.Close> */}
                        </form>
                    </Dialog.Description>
                </div>

                <Dialog.Close asChild>
                    <button onClick={setTextoOrAudioFalse} type='submit' className="Button absolute top-0 right-0 text-slate-700 font-semibold"><img className=' w-10 rounded-tr-lg' src="../../assets/close.png" alt="" /></button>
                </Dialog.Close>
            </Dialog.Content>
            </Dialog.Portal>
    </Dialog.Root>
    )
}