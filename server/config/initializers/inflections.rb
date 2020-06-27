# Be sure to restart your server when you modify this file.

# Add new inflection rules using the following format. Inflections
# are locale specific, and you may define rules for as many different
# locales as you wish. All of these examples are active by default:
# ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.plural /^(ox)$/i, '\1en'
#   inflect.singular /^(ox)en/i, '\1'
#   inflect.irregular 'person', 'people'
#   inflect.uncountable %w( fish sheep )
# end

ActiveSupport::Inflector.inflections do |inflect|
  inflect.uncountable %w( ods )

  # With plural
  inflect.acronym 'XPath'
  inflect.acronym 'XPaths'
  inflect.acronym 'API'
  inflect.acronym 'APIs'
  inflect.acronym 'XML'
  inflect.acronym 'XMLs'
  inflect.acronym 'JSON'
  inflect.acronym 'JSONs'
  inflect.acronym 'USB'
  inflect.acronym 'USBs'

  # No plural
  inflect.acronym 'JS'
  inflect.acronym 'JSS'
  inflect.acronym 'CSS'
  inflect.acronym 'HTML'
  inflect.acronym 'RESTful'
end
