$cube = Cube::Client.new 'localhost', 1180

class CubeSubscriber < ActiveSupport::LogSubscriber
  def sql(e)
    payload_name = e.payload[:name]

    if payload_name
      type = payload_name.split(' ').reverse.join.underscore
    else
      type = "sql_unnamed"
    end

    $cube.send type,
               e.time,
               e.transaction_id,
               duration_ms: e.duration,
               sql: e.payload[:sql]
  end
end

CubeSubscriber.attach_to :active_record

ActiveSupport::Notifications.subscribe /.*/ do |*args|
  e = ActiveSupport::Notifications::Event.new(*args)
  File.open(Rails.root.join('log', 'notifications.log'), 'a') do |f|
    f.puts e.name + " - " + e.payload.to_json
  end
end
