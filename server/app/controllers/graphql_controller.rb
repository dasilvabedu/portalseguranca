class GraphqlController < ApplicationController
  def execute
    variables = ensure_hash(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]

    context = {
      current_user: User.find_by_id(user_id)
    }.freeze

    result = GeocartSchema.execute(query,
                                          variables: variables,
                                          context: context,
                                          operation_name: operation_name)
    render json: result
  end

  private

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      ambiguous_param.present? ? ensure_hash(JSON.parse(ambiguous_param)) : {}
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end

  def authorization_header
    request.headers['Authorization']
  end

  def jwt
    return unless authorization_header
    authorization_header.split(' ').last
  end

  def user_id
    decoded_token = ::Authorization::JwtEncoder.decode(jwt)
    return unless decoded_token
    decoded_token[:sub]
  end
end
