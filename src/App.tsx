import { KeyboardEvent, useEffect, useRef, useState } from "react";
import DataImport from "./assets/diccionario.json";

const Data: (string | number)[][] = DataImport;

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

function App() {
  const [indexWord, setIndexWord] = useState(0);
  const { current: synth } = useRef(new SpeechSynthesisUtterance());
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const localStorageIndex = localStorage.getItem("word-index");
    setIndexWord(parseInt(localStorageIndex || "1"));
  }, []);

  useEffect(() => {
    speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    if (indexWord === 0) return;
    voice(`${Data[indexWord][1]}`, speed, () => voice(`${Data[indexWord][2]}`));
  }, [indexWord]);

  const handleChangePrevNext = (n: number) => {
    speechSynthesis.cancel();
    const sum = indexWord + n;

    if (sum < 0 || sum > Data.length) {
      return;
    }

    localStorage.setItem("word-index", `${sum}`);
    setIndexWord((i) => i + n);
  };

  const handleSetIndex = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const i = parseInt(e.currentTarget.value) || indexWord;
    localStorage.setItem("word-index", `${i - 1}`);
    setIndexWord(i - 1);
  };

  // const handleKeyDown: EventListener = (ev) => {
  //   ev.preventDefault();
  //   const key = ev.AT_TARGET;
  //   console.log(key);
  // };

  const voice = (text: string, s: number = speed, _callback?: Function) => {
    synth.rate = s;
    synth.text = text;
    speechSynthesis.speak(synth);
    if (_callback) {
      _callback();
    }
  };

  const handleVoice = (s: number = 1, title: boolean = false) => {
    setSpeed(s);
    if (title) return voice(`${Data[indexWord][1]}`, 0.2);
    voice(`${Data[indexWord][2]}`, s);
  };

  const handleCancelVoice = () => {
    speechSynthesis.cancel();
  };

  return (
    <div className="bg-teal-50">
      <div className="md:w-9/12 mx-auto">
        <h1 className="text-gray-900 text-6xl font-semibold text-center py-10">
          {capitalize(`${Data[indexWord][1]}`)}
        </h1>
        <p className="text-gray-600 md:text-3xl text-2xl text-center py-10">{`${Data[indexWord][2]}`}</p>
        <div className="md:w-3/12 mx-auto grid grid-cols-4 py-20 gap-4 px-4 lg:px-0">
          <button
            onClick={() => handleChangePrevNext(-1)}
            className="px-10 py-2 rounded-xl bg-blue-200 text-gray-700 text-2xl font-semibold col-span-2"
          >
            Prev
          </button>
          <button
            onClick={() => handleChangePrevNext(1)}
            className="px-10 py-2 rounded-xl bg-emerald-200 text-gray-700 text-2xl font-semibold col-span-2"
          >
            Next
          </button>
          <input
            value={indexWord + 1}
            onChange={handleSetIndex}
            className="text-center py-2 rounded-xl bg-pink-200 text-gray-700 text-2xl col-span-4 focus:outline-0 font-semibold"
            type="number"
            min="1"
            max={Data.length + 1}
          />
          <button
            onClick={() => handleVoice(0.1)}
            className="py-2 rounded-xl bg-teal-200 text-gray-700 text-xl font-semibold"
          >
            x0.1
          </button>
          <button
            onClick={() => handleVoice(0.5)}
            className="py-2 rounded-xl bg-teal-300 text-gray-700 text-xl font-semibold"
          >
            x0.5
          </button>
          <button
            onClick={() => handleVoice(1)}
            className="py-2 rounded-xl bg-teal-400 text-gray-700 text-xl font-semibold"
          >
            x1
          </button>
          <button
            onClick={() => handleVoice(2)}
            className="py-2 rounded-xl bg-teal-500 text-gray-700 text-xl font-semibold"
          >
            x2
          </button>
          <button
            onClick={handleCancelVoice}
            className="py-2 rounded-xl bg-red-200 text-white-700 text-2xl font-semibold col-span-4"
          >
            STOP
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
