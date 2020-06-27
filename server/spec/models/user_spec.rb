require 'rails_helper'

RSpec.describe Topic, type: :model do
  subject { create(:topic) }

  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_uniqueness_of(:key).case_insensitive }
  it { expect(subject.key).to_not be_blank }

  it { is_expected.to have_many(:subtopics) }
end
