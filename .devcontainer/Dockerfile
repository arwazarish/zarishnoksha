FROM ubuntu:24.04

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=${USER_UID}

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install base packages
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    git-lfs \
    openssh-client \
    gnupg2 \
    ca-certificates \
    lsb-release \
    sudo \
    unzip \
    zip \
    build-essential \
    python3 \
    python3-pip \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --gid ${USER_GID} ${USERNAME} \
    && useradd -s /bin/zsh --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME} \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME}

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash -s "bun" \
    && chown -R ${USERNAME}:${USER_UID} /home/${USERNAME}/.bun

# Install Node.js 24 via nvm
RUN su - ${USERNAME} -c 'curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash' \
    && su - ${USERNAME} -c 'nvm install 24 && nvm alias default 24'

# Install Zsh + Oh My Zsh
RUN apt-get update && apt-get install -y zsh \
    && rm -rf /var/lib/apt/lists/* \
    && su - ${USERNAME} -c 'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended' \
    && su - ${USERNAME} -c 'git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-/home/${USERNAME}/.oh-my-zsh/custom}/plugins/zsh-autosuggestions' \
    && su - ${USERNAME} -c 'git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-/home/${USERNAME}/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting' \
    && sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/' /home/${USERNAME}/.zshrc

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update && apt-get install gh -y \
    && rm -rf /var/lib/apt/lists/*

# Install Playwright system deps
RUN su - ${USERNAME} -c 'npm install -g playwright@latest' \
    && su - ${USERNAME} -c 'npx playwright install --with-deps chromium'

# Install Puppeteer Chrome
RUN su - ${USERNAME} -c 'npx puppeteer browsers install chrome'

# Pre-create command history directory
RUN mkdir -p /home/${USERNAME}/commandhistory \
    && chown -R ${USERNAME}:${USER_UID} /home/${USERNAME}/commandhistory

ENV DEBIAN_FRONTEND=dialog
