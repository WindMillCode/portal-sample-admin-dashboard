        # is puffing billy doing something here
        posts_reqs = Billy.proxy.requests.select  do |x|
            x[:method] = %{POST} and x[:url].include?  %{http://127.0.0.1:3005}
          end
          # PP.pp posts_reqs
          puts TablePrint::Printer.table_print(posts_reqs, [
            :status,
            :handler,
            :method,
            { url: { width: 100 } },
            :headers,
            :body
          ])
