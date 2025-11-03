interface CreatePersonaFormProps {
  handlePersonaSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setPersonaName: (name: string) => void;
  personaName: string;
  personaBio: string;
  setPersonaBio: (bio: string) => void;
  setTone: (tone: number) => void;
  tone: number;
  witty: number;
  setWitty: (witty: number) => void;
  aspiration: number;
  setAspiration: (aspiration: number) => void;
  setCta: (cta: string) => void;
  cta: string;
  safetyNotes: string;
  setSafetyNotes: (notes: string) => void;
}

const CreatePersonaForm: React.FC<CreatePersonaFormProps> = ({
  handlePersonaSubmit,
  setPersonaName,
  personaName,
  personaBio,
  setPersonaBio,
  setTone,
  tone,
  witty,
  setWitty,
  aspiration,
  setAspiration,
  setCta,
  cta,
  safetyNotes,
  setSafetyNotes,
}) => {
  return (
    <form onSubmit={handlePersonaSubmit} className="space-y-6 w-full ">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Persona</h2>

      <div>
        <label
          htmlFor="personaName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Name *
        </label>
        <input
          type="text"
          id="personaName"
          value={personaName}
          onChange={(e) => setPersonaName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          required
        />
      </div>

      <div>
        <label
          htmlFor="personaBio"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Bio *
        </label>
        <textarea
          id="personaBio"
          value={personaBio}
          onChange={(e) => setPersonaBio(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          required
        />
      </div>

      <div>
        <label
          htmlFor="tone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tone: {tone}
        </label>
        <input
          type="range"
          id="tone"
          min="1"
          max="10"
          value={tone}
          onChange={(e) => setTone(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      <div>
        <label
          htmlFor="witty"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Witty: {witty}
        </label>
        <input
          type="range"
          id="witty"
          min="1"
          max="10"
          value={witty}
          onChange={(e) => setWitty(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      <div>
        <label
          htmlFor="aspiration"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Aspiration: {aspiration}
        </label>
        <input
          type="range"
          id="aspiration"
          min="1"
          max="10"
          value={aspiration}
          onChange={(e) => setAspiration(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      <div>
        <label
          htmlFor="cta"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          CTA *
        </label>
        <input
          type="text"
          id="cta"
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          required
        />
      </div>

      <div>
        <label
          htmlFor="safetyNotes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Safety Notes *
        </label>
        <textarea
          id="safetyNotes"
          value={safetyNotes}
          onChange={(e) => setSafetyNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold mb-3"
      >
        Create Persona
      </button>
    </form>
  );
};

export default CreatePersonaForm;
