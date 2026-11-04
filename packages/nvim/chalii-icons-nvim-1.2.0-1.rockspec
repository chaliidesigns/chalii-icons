package = "chalii-icons-nvim"
version = "1.2.0-1"

source = {
    url    = "git+https://github.com/chaliidesigns/chalii-icons.git",
    tag    = "nvim/v1.2.0",
}

description = {
    summary  = "Chalii file icons for Neovim (nvim-web-devicons / mini.icons overlay)",
    detailed = [[
        File-icon overlay for nvim-web-devicons and mini.icons using the
        same 84-icon manifest as the Chalii Icons VS Code extension and
        JetBrains plugin.  Maps each Chalii file type to the closest Nerd
        Font codepoint plus a Chalii palette color.  Supports dark and light
        terminal themes via per-icon light_color overrides.
    ]],
    homepage = "https://github.com/chaliidesigns/chalii-icons",
    license  = "MIT",
}

dependencies = {
    "lua >= 5.1",
}

build = {
    type    = "builtin",
    modules = {
        ["chalii-icons"]              = "packages/nvim/lua/chalii-icons/init.lua",
        ["chalii-icons.icons"]        = "packages/nvim/lua/chalii-icons/icons.lua",
        ["chalii-icons.mini"]         = "packages/nvim/lua/chalii-icons/mini.lua",
    },
}
