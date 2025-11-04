import { CampaignForm } from "@/lib/types";

interface CreateCampaignFormProps {
  handleCampaignSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  campaignForm: CampaignForm;
  setCampaignForm: (campaignForm: CampaignForm) => void;
}

const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({
  handleCampaignSubmit,
  campaignForm,
  setCampaignForm,
}) => {
  return (
    <form onSubmit={handleCampaignSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Register New Campaign
      </h2>

      <div>
        <label
          htmlFor="campaignName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Campaign Name *
        </label>
        <input
          type="text"
          id="campaignName"
          value={campaignForm.name}
          onChange={(e) =>
            setCampaignForm({ ...campaignForm, name: e.target.value })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          required
        />
      </div>

      <div>
        <label
          htmlFor="campaignObjective"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Campaign Objective *
        </label>
        <textarea
          id="campaignObjective"
          value={campaignForm.objective}
          onChange={(e) =>
            setCampaignForm({
              ...campaignForm,
              objective: e.target.value,
            })
          }
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            value={campaignForm.start_date}
            onChange={(e) =>
              setCampaignForm({
                ...campaignForm,
                start_date: e.target.value,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            value={campaignForm.end_date}
            onChange={(e) =>
              setCampaignForm({
                ...campaignForm,
                end_date: e.target.value,
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-6 py-3 rounded-lg font-semibold transition duration-200 bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Submit Campaign
      </button>
    </form>
  );
};

export default CreateCampaignForm;