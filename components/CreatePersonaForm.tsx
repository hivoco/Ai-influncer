import { PersonaForm } from "@/lib/types";

interface CreatePersonaFormProps {
  handlePersonaSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  personaForm: PersonaForm;
  setPersonaForm: (personaForm: PersonaForm) => void;
}

const CreatePersonaForm: React.FC<CreatePersonaFormProps> = ({
  handlePersonaSubmit,
  personaForm,
  setPersonaForm,
}) => {
  return (
    <form onSubmit={handlePersonaSubmit} className="space-y-6">
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
          value={personaForm.persona_name}
          onChange={(e) =>
            setPersonaForm({
              ...personaForm,
              persona_name: e.target.value,
            })
          }
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
          value={personaForm.bio}
          onChange={(e) =>
            setPersonaForm({
              ...personaForm,
              bio: e.target.value,
            })
          }
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
          Tone: {personaForm.tone_formal}
        </label>
        <input
          type="range"
          id="tone"
          min="1"
          max="10"
          value={personaForm.tone_formal}
          onChange={(e) =>
            setPersonaForm({
              ...personaForm,
              tone_formal: Number(e.target.value),
            })
          }
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
          Witty: {personaForm.tone_witty}
        </label>
        <input
          type="range"
          id="witty"
          min="1"
          max="10"
          value={personaForm.tone_witty}
          onChange={(e) =>
            setPersonaForm({
              ...personaForm,
              tone_witty: Number(e.target.value),
            })
          }
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
          Aspiration: {personaForm.tone_aspirational}
        </label>
        <input
          type="range"
          id="aspiration"
          min="1"
          max="10"
          value={personaForm.tone_aspirational}
          onChange={(e) =>
            setPersonaForm({
              ...personaForm,
              tone_aspirational: Number(e.target.value),
            })
          }
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
          value={personaForm.default_cta}
          onChange={(e) =>
            setPersonaForm({
              ...personaForm,
              default_cta: e.target.value,
            })
          }
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
          value={personaForm.safety_notes}
          onChange={(e) =>
            setPersonaForm({
              ...personaForm,
              safety_notes: e.target.value,
            })
          }
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          required
        />
      </div>

      <button
        type="submit"
        className="px-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
      >
        Create Persona
      </button>
    </form>
  );
};

export default CreatePersonaForm;
