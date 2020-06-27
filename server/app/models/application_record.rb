class ApplicationRecord < ActiveRecord::Base
  attr_accessor :being_manipulated_by_manager
  after_initialize :initialize_instance_variables

  self.abstract_class = true

  def initialize_instance_variables
    @being_manipulated_by_manager = false
  end

  def to_h
    JSON.parse(self.to_json).with_indifferent_access
  end

  def self.truncate(cascade: false)
    query = "TRUNCATE #{self.table_name}#{' CASCADE' if cascade}"
    ActiveRecord::Base.connection.execute(query)
  end
end
