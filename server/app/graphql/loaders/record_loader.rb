class Loaders::RecordLoader < GraphQL::Batch::Loader
  def initialize(model, column: model.primary_key, where: nil, many: false)
    @model = model
    @column = column.to_s
    @column_type = model.type_for_attribute(@column)
    @where = where
    @many = many
  end

  def load(key)
    super(@column_type.cast(key))
  end

  def perform(keys)
    result = query(keys)
    if @many
      grouped_results = result.group_by { |record| record.public_send(@column) }
      grouped_results.each { |key, records| fulfill(key, records) }
      keys.each { |key| fulfill(key, []) unless fulfilled?(key) }
    else
      result.each { |record| fulfill(record.public_send(@column), record) }
      keys.each { |key| fulfill(key, nil) unless fulfilled?(key) }
    end
  end

  private

  def query(keys)
    scope = @model
    scope = scope.where(@where) if @where
    scope.where(@column => keys)
  end
end
