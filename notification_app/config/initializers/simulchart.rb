$cube = Cube::Client.new 'localhost', 1180

class CubeSubscriber < ActiveSupport::LogSubscriber
  def sql(e)
    $cube.send "as_notification",
               e.time,
               e.transaction_id,
               name: e.name,
               duration_ms: e.duration
  end
end

CubeSubscriber.attach_to :active_record

ActiveSupport::Notifications.subscribe /.*/ do |*args|
  e = ActiveSupport::Notifications::Event.new(*args)
  File.open(Rails.root.join('log', 'notifications.log'), 'a') do |f|
    f.puts e.name + " - " + e.payload.to_json
  end
end
