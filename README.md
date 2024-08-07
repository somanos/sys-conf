# sys-conf
Light weight Linux system configurator.

## Why?
There are plentyful varieties of system configurations files that need to customized. sed + awk may work with small and simple set of config files. Ansible may be a too heavy machine for a relatively modest deployment.

## Synopsys
sys-conf shall take recursively:
    * data stored in key=value pairs format from a designated directory (--data) 
    * apply them on templates stored in another directory (--templates)
    * generate output configuration files in the output directory (--output). The output keeps the same tree structure as the one from the templates directory.
Some output filename can be dynamically mapped with value taken from data. For example, examples/nginx/sites-enabled/map:web-domain.conf shall be written as outputdir/nginx/sites-enabled/my-domain.com.conf
if data has a keypair web_domain=my-domain.com

## Usage 
    --data data shall be be collected from here to render the templates
    --templates configuration path with tree structure
    --output output configuration path
    --confilct-policy=skip|overwrite
```console
    git clone https://github.com/somanos/sys-conf
    cd sys-conf
    node index.js --data=./data --conflict-policy=skip --templates=./examples --output=/tmp/sys-conf
```

## Example
```console
    node index.js --data=./data --conflict-policy=skip --templates=./examples --output=/tmp/sys-conf
```
## Install 

```console
    npm i @somanos/sys-conf
```
    global install

```console
    curl https://raw.githubusercontent.com/somanos/sys-conf/main/bin/install-global | sudo sh -
```
